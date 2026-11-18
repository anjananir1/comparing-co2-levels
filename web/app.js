
import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6.17/+esm";

// Original climate data sources
const MODERN_URL =
  "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.csv";

const HISTORICAL_URL =
  "https://www.ncei.noaa.gov/pub/data/paleo/icecore/antarctica/vostok/co2nat-noaa.txt";

// Page elements
const dataset = document.querySelector("#dataset");
const measure = document.querySelector("#measure");
const start = document.querySelector("#start");
const startLabel = document.querySelector("#start-label");
const chart = document.querySelector("#chart");
const caption = document.querySelector("#caption");

let modernData = [];
let historicalData = [];
let modernError = null;
let historicalError = null;

const formatNumber = (value) =>
  Number(value).toLocaleString("en-US");

// Show loading and error messages
function showMessage(text) {
  const message = document.createElement("p");
  message.id = "status";
  message.setAttribute("role", "status");
  message.textContent = text;
  chart.replaceChildren(message);
}

// Download a real data file
async function getText(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Data request failed: ${response.status}`);
  }

  return response.text();
}

// Read NOAA annual Mauna Loa CO2 measurements
async function loadModernData() {
  const text = await getText(MODERN_URL);

  const rows = text.split(/\r?\n/);
  const data = [];

  for (const row of rows) {
    const line = row.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const values = line.split(",").map((v) => v.trim());

    const year = Number(values[0]);
    const co2 = Number(values[1]);

    if (
      Number.isInteger(year) &&
      year >= 1958 &&
      year <= 2100 &&
      Number.isFinite(co2) &&
      co2 > 0
    ) {
      data.push({
        year,
        age: 1950 - year,
        co2,
        source: "Modern measurements"
      });
    }
  }

  if (data.length === 0) {
    throw new Error("No valid modern CO2 measurements found.");
  }

  return data.sort((a, b) => a.year - b.year);
}

// Read the Vostok ice-core CO2 record
async function loadHistoricalData() {
  const text = await getText(HISTORICAL_URL);

  const rows = text.split(/\r?\n/);
  const data = [];

  for (const row of rows) {
    const line = row.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    // The NOAA file has two columns:
    // gas age (years BP) and CO2 (ppm)
    const values = line.split(/\s+/);

    if (values.length !== 2) {
      continue;
    }

    const age = Number(values[0]);
    const co2 = Number(values[1]);

    if (
      Number.isFinite(age) &&
      age >= 0 &&
      age <= 400000 &&
      Number.isFinite(co2) &&
      co2 > 0
    ) {
      data.push({
        age,
        co2,
        source: "Vostok ice core"
      });
    }
  }

  if (data.length === 0) {
    throw new Error("No valid historical CO2 measurements found.");
  }

  return data.sort((a, b) => a.age - b.age);
}

// Set the slider based on the selected dataset
function updateSlider() {
  const selection = dataset.value;

  if (selection === "modern") {
    start.min = "1959";
    start.max = String(
      modernData.length
        ? modernData[modernData.length - 1].year
        : 2025
    );
    start.step = "1";
    start.value = "1959";
    start.parentElement.firstChild.textContent =
      "Starting Year ";
  } else {
    start.min = "10000";
    start.max = "400000";
    start.step = "10000";
    start.value = "400000";
    start.parentElement.firstChild.textContent =
      "Years to Look Back ";
  }

  update();
}

// Create a CO2 chart
function makeChart(data, xField, xLabel, title) {
  const wrapper = document.createElement("div");

  const heading = document.createElement("h3");
  heading.textContent = title;
  wrapper.appendChild(heading);

  const plot = Plot.plot({
    width: Math.max(320, chart.clientWidth),
    height: 350,
    marginLeft: 65,
    marginBottom: 55,

    x: {
      label: xLabel,
      grid: true,
      reverse: xField === "age",
      tickFormat: (d) => formatNumber(d)
    },

    y: {
      label: "CO2 concentration (ppm)",
      grid: true,
      domain: [150, 460]
    },

    marks: [
      Plot.lineY(data, {
        x: xField,
        y: "co2",
        stroke: "#168b85",
        strokeWidth: 2.5,
        tip: true
      }),

      Plot.dot(data, {
        x: xField,
        y: "co2",
        r: 2,
        fill: "#168b85",
        tip: true
      })
    ]
  });

  plot.setAttribute(
    "aria-label",
    `${title}: atmospheric carbon dioxide in parts per million`
  );

  wrapper.appendChild(plot);
  return wrapper;
}

// Update the charts when the user changes a control
function update() {
  const selection = dataset.value;
  const value = Number(start.value);

  startLabel.value = formatNumber(value);
  chart.replaceChildren();

  if (selection === "modern") {
    if (modernError) {
      showMessage(`Modern data unavailable: ${modernError.message}`);
      return;
    }

    const filtered = modernData.filter(
      (row) => row.year >= value
    );

    if (!filtered.length) {
      showMessage("No modern measurements for this time range.");
      return;
    }

    chart.appendChild(
      makeChart(
        filtered,
        "year",
        "Calendar year",
        "Modern CO2 Measurements"
      )
    );

    caption.textContent =
      `Annual CO2 measurements from ${value} onward, ` +
      "recorded at Mauna Loa Observatory. Units: ppm.";

  } else if (selection === "historical") {
    if (historicalError) {
      showMessage(
        `Historical data unavailable: ${historicalError.message}`
      );
      return;
    }

    const filtered = historicalData.filter(
      (row) => row.age <= value
    );

    if (!filtered.length) {
      showMessage("No ice-core measurements in this time range.");
      return;
    }

    chart.appendChild(
      makeChart(
        filtered,
        "age",
        "Years before 1950 (BP)",
        "Historical CO2 Levels"
      )
    );

    caption.textContent =
      `Vostok ice-core CO2 measurements from the last ` +
      `${formatNumber(value)} years. ` +
      "The horizontal axis shows years before 1950.";

  } else {
    if (historicalError || modernError) {
      showMessage(
        "Both datasets are needed for this comparison. " +
        "One or more sources could not be loaded. " +
        "Please check your connection and reload."
      );
      return;
    }

    const historical = historicalData.filter(
      (row) => row.age <= value
    );

    if (!historical.length || !modernData.length) {
      showMessage("No data available for this comparison.");
      return;
    }

    // Two panels preserve the different time scales.
    chart.appendChild(
      makeChart(
        historical,
        "age",
        "Years before 1950 (BP)",
        "Historical CO2 Levels"
      )
    );

    chart.appendChild(
      makeChart(
        modernData,
        "year",
        "Calendar year",
        "Modern CO2 Levels"
      )
    );

    caption.textContent =
      "Both charts use the same CO2 scale (ppm), " +
      "but different time axes. The historical record " +
      "comes from Antarctic ice cores, while the modern " +
      "record comes from direct atmospheric measurements.";
  }
}

// Load both datasets when the page opens
async function initialize() {
  showMessage("Loading climate data...");

  const results = await Promise.allSettled([
    loadModernData(),
    loadHistoricalData()
  ]);

  if (results[0].status === "fulfilled") {
    modernData = results[0].value;
  } else {
    modernError = results[0].reason;
    console.error("Modern data error:", modernError);
  }

  if (results[1].status === "fulfilled") {
    historicalData = results[1].value;
  } else {
    historicalError = results[1].reason;
    console.error("Historical data error:", historicalError);
  }

  updateSlider();
}

// Listen for user interactions
dataset.addEventListener("change", updateSlider);
start.addEventListener("input", update);

// The measurement is fixed to CO2 concentration
measure.addEventListener("change", update);

// Resize charts when the window changes size
let resizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(update, 200);
});

// Start the application
initialize();
