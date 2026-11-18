# Design Document

## Readers

Our app is for students and anyone interested in learning about climate change and atmospheric CO2 levels. We wanted to answer how CO2 levels have changed over time and how recent measurements compare to the past 400,000 years. We wanted to make it easier for people to understand the data without having to look through the original datasets themselves.

## Data

Our app builds on Module 1, where we worked with climate data.

We used two datasets:

1. NOAA Mauna Loa CO2 measurements:
   https://gml.noaa.gov/ccgg/trends/

2. Vostok Antarctic ice core CO2 records:
   https://doi.org/10.3334/CDIAC/ATG.009

The NOAA dataset contains annual CO2 measurements beginning in 1959, while the Vostok dataset covers approximately 400,000 years of historical CO2 estimates.

Both datasets are relatively small text-based files that the browser can download and process directly using JavaScript. We did not need a separate backend or database.

## Verification Against Module 1

Our Module 4 application builds on the atmospheric CO2 analysis from Module 1. To check that the data are being displayed correctly, we can compare the modern CO2 graph in our application with the corresponding measurements in our original `climate.ipynb` notebook.

We will use the same year and CO2 concentration from both sources and check whether the values agree in parts per million (ppm). We will also compare the overall trend to make sure the graph represents the data correctly.

Our application reads the NOAA measurements directly from the original data source, rather than using manually entered values.

## Interactions

We included three controls so users can explore the data themselves.

- Dataset dropdown: Users can choose modern CO2 measurements, historical ice core data, or both. The graphs update depending on their selection.
- Measurement dropdown: This displays CO2 concentration in parts per million (ppm). We kept the measurement consistent because both datasets use the same units.
- Time slider: Users can change the starting year for modern measurements or how many years back they want to explore for historical data. The graph updates based on the selected range.

We wanted the controls to be simple so users could focus on understanding how CO2 levels have changed.

## Path

We chose the interactive data visualization path because our main goal was to help users explore climate data through graphs.

Instead of only presenting static charts, we wanted people to be able to change the time period and switch between modern and historical measurements. This made it easier to compare different periods of Earth's climate history.

## Dependencies

Our app uses:

- Observable Plot version 0.6.17: Creates the CO2 line graphs and displays the data.
- JavaScript: Loads and processes the datasets and updates the graphs when users change the controls.
- HTML: Provides the structure of the website and the interactive controls.
- CSS: Handles the layout and makes the website easier to use on different screen sizes.

We chose Observable Plot because it allowed us to create readable graphs without having to build the entire visualization system ourselves.

## Tests

Our automated tests are located in the `tests/` folder. We used Playwright and pytest to check that the app loads and that the interactive features work.

The tests check that users can switch between modern and historical datasets, display both graphs, and change the time range using the slider. They also check how the app responds when data cannot be loaded and whether the layout works at a smaller screen size.

One limitation is that our tests use sample data, so they cannot guarantee that NOAA's external data links will always be available. We also manually checked the published website to make sure the graphs were displaying correctly.

## License

We chose the MIT License for our original project code because it allows other people to use, modify, and share our work as long as they keep the copyright and license notice.

Our modern CO2 measurements come from NOAA, and our historical CO2 measurements come from the Vostok ice core records archived by NOAA's National Centers for Environmental Information (NCEI).

NOAA provides its paleoclimatology data for public access and asks users to cite the original datasets and research. We included links to our data sources and use the measurements for an educational visualization. We did not include copies of the original datasets in our repository.

The MIT License applies to our own code and does not replace any terms associated with the original datasets or third-party libraries.


## Accessibility and Layout

We manually tested the published website on both desktop and mobile screens to make sure the graphs, dropdowns, and slider worked correctly. We also tested keyboard navigation by using the Tab and arrow keys to interact with the controls without a mouse. The controls responded correctly, and the graphs updated based on our selections.
