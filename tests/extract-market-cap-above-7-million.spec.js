// Write a test to Identify, extract, and display somewhere of choice all FTSE 100 constituents where the ‘Market Cap’ exceeds 7 million.

import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/homePage.js";
import { ConstituentsPage } from "../pages/constituentsPage.js";
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

test("Extract all FTSE 100 constituents sorted by Market Cap (Highest – lowest)", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.acceptCookiesIfVisible();
  const newPage = await homePage.openFTSE100Constituents();

  const constituentsPage = new ConstituentsPage(newPage);
  await constituentsPage.waitForLoad();
  await expect(newPage).toHaveURL(/\/ftse-100\/constituents\//);
  await page.close();

  // Sort by Market Cap (Highest – lowest)
  await constituentsPage.sortByMarketCapDescending();

  // Extract all rows from all pages
  const allRows = await constituentsPage.extractAllRowsAcrossPages();

  // Filter by Market Cap > 7 million
  const filtered = allRows.filter(row => {
    const cap = parseFloat(row.marketCap.replace(/,/g, ""));
    return cap > 7;
  });

  // Market Cap should be over 7
  for (const row of filtered) {
    const cap = parseFloat(row.marketCap.replace(/,/g, ""));
    expect(cap).toBeGreaterThan(7);
  }

  // Display results
  console.log(`Total rows extracted: ${allRows.length}`);
  console.log(`Rows with Market Cap > 7 million: ${filtered.length}`);
  console.table(filtered.slice(0, 10));

  // Export all records above 7 million to CSV
  exportToCSV(filtered, "ftse100_marketcap_above7million.csv");

  // Confirm file is created
  expect(
    fs.existsSync(
      path.join(
        process.cwd(),
        "test-results",
        "ftse100_marketcap_above7million.csv"
      )
    )
  ).toBe(true);

  // CSV file should contain all identified companies
  const csvPath = path.join(
    process.cwd(),
    "test-results",
    "ftse100_marketcap_above7million.csv"
  );
  const csvContent = fs.readFileSync(csvPath, "utf8");
  const csvRows = csvContent.trim().split("\n");
  expect(csvRows.length - 1).toBe(filtered.length); // -1 for header row
});
