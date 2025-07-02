// Write a test to determine which month over the past three years recorded the lowest average index value.

import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/homePage.js";
import { IndicesPage } from "../pages/indicesPage.js";
import fs from "fs";
import path from "path";

function exportToCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(row =>
    Object.values(row)
      .map(val => `"${val}"`)
      .join(",")
  );
  const csvContent = [headers, ...rows].join("\n");
  const resultsDir = path.join(process.cwd(), "test-results");
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }
  const filePath = path.join(resultsDir, filename);
  fs.writeFileSync(filePath, csvContent, "utf8");
}

test("Find the month with the lowest average FTSE 100 index value over the past 3 years", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.acceptCookiesIfVisible();
  const indicesPage = new IndicesPage(await homePage.openIndicesPage());

  await indicesPage.waitForIntradayTable();
  await page.close();

  await indicesPage.openFTSE100Index();

  // Set the date range to 3 years ago
  const now = new Date();
  const threeYearsAgo = now.getFullYear() - 3;
  await indicesPage.setYearFrom(threeYearsAgo);

  // Provides monthly average
  await indicesPage.setPeriodicityToMonthly();

  // Get all points on the graph
  const points = await indicesPage.getMonthlyPoints();

  let lowest = { value: Infinity, month: null, year: null };
  const allData = [];

  for (const point of points) {
    const monthMarker = await point.getAttribute("aria-label");
    // "Price of base ric is 7037.47 30 June 2021"
    const match =
      monthMarker &&
      monthMarker.match(/is ([\d.]+) (\d{1,2}) ([A-Za-z]+) (\d{4})/);
    if (match) {
      const value = parseFloat(match[1]);
      const day = match[2];
      const month = match[3];
      const year = match[4];
      allData.push({ value, month, year });
      if (value < lowest.value) {
        lowest = { value, month, year };
      }
    }
  }

  // Export all points to CSV
  exportToCSV(allData, "ftse100_monthly_averages.csv");

  // Read and parse the CSV file
  const csvPath = path.join(process.cwd(), "test-results", "ftse100_monthly_averages.csv");
  const csvContent = fs.readFileSync(csvPath, "utf8");
  const csvRows = csvContent.trim().split("\n").slice(1); // skip header

  // Parse CSV rows into objects
  const csvData = csvRows.map(row => {
    const [value, month, year] = row.split(",").map(cell => cell.replace(/"/g, ""));
    return {
      value: parseFloat(value),
      month,
      year,
    };
  });

  // Find the row with the lowest value in the CSV
  const csvLowest = csvData.reduce((min, curr) => (curr.value < min.value ? curr : min), csvData[0]);

  // Assert that the lowest from the test matches the lowest in the CSV
  expect(csvLowest.value).toBeCloseTo(lowest.value, 2);
  expect(csvLowest.month).toBe(lowest.month);
  expect(csvLowest.year).toBe(lowest.year);

  console.log(
    `Lowest FTSE 100 index value: ${lowest.value} in ${lowest.month} ${lowest.year}`
  );
  expect(lowest.month).not.toBeNull();
});
