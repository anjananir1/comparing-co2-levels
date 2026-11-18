
import functools
import http.server
import threading
from pathlib import Path

import pytest
from playwright.sync_api import expect

WEB = Path(__file__).resolve().parents[1] / "web"

MODERN_CSV = """# Sample annual CO2 measurements
1959,315.98
1960,316.91
1970,325.68
1980,338.75
1990,354.39
2000,369.55
2010,389.85
2020,414.24
2024,424.61
"""

HISTORICAL_TXT = """# Sample ice-core measurements
1000 280
10000 265
50000 210
100000 240
200000 230
300000 260
400000 280
"""


@pytest.fixture(scope="session")
def url():
    handler = functools.partial(
        http.server.SimpleHTTPRequestHandler,
        directory=WEB
    )
    server = http.server.ThreadingHTTPServer(
        ("127.0.0.1", 0), handler
    )
    threading.Thread(
        target=server.serve_forever,
        daemon=True
    ).start()

    yield f"http://127.0.0.1:{server.server_port}/"
    server.shutdown()
    server.server_close()


def mock_data(page, modern=True, historical=True):
    def handle_modern(route):
        if modern:
            route.fulfill(
                status=200,
                content_type="text/plain",
                body=MODERN_CSV
            )
        else:
            route.abort()

    def handle_historical(route):
        if historical:
            route.fulfill(
                status=200,
                content_type="text/plain",
                body=HISTORICAL_TXT
            )
        else:
            route.abort()

    page.route(
        "**/ccgg/trends/co2/co2_annmean_mlo.csv",
        handle_modern
    )
    page.route(
        "**/vostok/co2nat-noaa.txt",
        handle_historical
    )


@pytest.fixture
def app(page, url):
    mock_data(page)
    page.goto(url)

    expect(
        page.locator("#chart svg")
    ).to_be_visible(timeout=30000)

    yield page


def test_chart_draws(app):
    expect(
        app.get_by_role(
            "heading", name="Modern CO2 Measurements"
        )
    ).to_be_visible()

    expect(app.locator("#chart svg")).to_have_count(1)
    expect(app.locator("#caption")).to_contain_text(
        "Mauna Loa Observatory"
    )


def test_controls_redraw_chart(app):
    app.select_option("#dataset", "historical")

    expect(
        app.get_by_role(
            "heading", name="Historical CO2 Levels"
        )
    ).to_be_visible()

    expect(app.locator("#caption")).to_contain_text(
        "Vostok ice-core"
    )

    app.select_option("#dataset", "both")

    expect(app.locator("#chart svg")).to_have_count(2)

    expect(app.locator("#caption")).to_contain_text(
        "Both charts"
    )


def test_slider_updates_chart(app):
    app.locator("#start").fill("2000")
    app.locator("#start").dispatch_event("input")

    expect(app.locator("#start-label")).to_have_text(
        "2,000"
    )

    expect(app.locator("#caption")).to_contain_text(
        "2000 onward"
    )


def test_historical_time_range(app):
    app.select_option("#dataset", "historical")

    expect(app.locator("#start")).to_have_attribute(
        "max", "400000"
    )

    expect(app.locator("#start-label")).to_have_text(
        "400,000"
    )

    expect(app.locator("#caption")).to_contain_text(
        "400,000 years"
    )


def test_fits_a_phone_screen(app):
    app.set_viewport_size({
        "width": 390,
        "height": 844
    })

    overflow = app.evaluate(
        "document.documentElement.scrollWidth > window.innerWidth"
    )

    assert not overflow


def test_says_when_the_data_cannot_load(page, url):
    mock_data(page, modern=False, historical=False)
    page.goto(url)

    expect(page.locator("#status")).to_contain_text(
        "Modern data unavailable",
        timeout=30000
    )

    page.select_option("#dataset", "both")

    expect(page.locator("#status")).to_contain_text(
        "could not be loaded"
    )

    expect(page.locator("#chart svg")).to_have_count(0)
