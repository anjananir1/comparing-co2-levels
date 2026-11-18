
# Comparing CO2 Levels Across Time

[![App check](https://github.com/anjananir1/comparing-co2-levels/actions/workflows/check.yml/badge.svg)](https://github.com/anjananir1/comparing-co2-levels/actions/workflows/check.yml)

## About the Project

For our ESPM 157 Module 4 project, we wanted to look at how atmospheric CO2 levels have changed over time. We decided to compare modern CO2 measurements with historical ice core records to see how recent changes compare to the past 400,000 years.

This project builds on the climate data we worked with in Module 1. We created an interactive website where users can look at different time periods and see how CO2 concentrations have changed.

## What the App Does

The app allows users to:

- View modern CO2 measurements from Mauna Loa Observatory.
- Look at historical CO2 levels from Antarctic ice cores.
- Compare modern and historical CO2 records.
- Change the time range using a slider.
- Explore how CO2 concentrations have changed over time.

## Data Sources

We used two datasets for this project.

**NOAA Mauna Loa CO2 Data**

This dataset contains modern atmospheric CO2 measurements beginning in 1958. We used the annual measurements to look at how CO2 concentrations have changed in recent decades.

https://gml.noaa.gov/ccgg/trends/

**Vostok Ice Core Data**

This dataset uses air trapped in Antarctic ice cores to estimate atmospheric CO2 levels from hundreds of thousands of years ago. We used it to compare historical CO2 concentrations with modern measurements.

https://doi.org/10.3334/CDIAC/ATG.009

Both datasets measure atmospheric CO2 concentration in parts per million (ppm).

## How the App Works

We built the app using HTML, CSS, and JavaScript. We used Observable Plot to display the CO2 data in interactive graphs.

Users can choose between modern measurements, historical ice core data, or a comparison of both. There is also a slider that lets users change the time period they want to look at.

When comparing both datasets, the app shows two graphs because the historical and modern records cover very different time scales.

## Tools Used

- HTML for the website structure
- CSS for the layout and styling
- JavaScript for loading data and updating the graphs
- Observable Plot for data visualization
- GitHub Pages for publishing the website
- GitHub Actions and Playwright for automated testing

## What We Learned

This project helped us understand how to turn climate data into something that other people can interact with. We thought it was interesting to compare recent CO2 measurements with records from so long ago, especially because the two datasets were collected in completely different ways.

We also learned more about building a website, working with JavaScript, and troubleshooting issues with the graphs and automated tests.

## Project Links

**GitHub Repository:**
https://github.com/anjananir1/comparing-co2-levels

**Website:**
https://anjananir1.github.io/comparing-co2-levels/

## AI Usage

We used AI to help us throughout this project, mainly for troubleshooting errors, understanding parts of the code, and figuring out how to improve the graphs and layout. We still worked on writing and putting together the project ourselves, including choosing the topic, deciding how we wanted the data to be displayed, and making changes to the code.

## Authors

Anjana Niranjanan and Sophia Barbosa
