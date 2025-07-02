// Apologies for using javascript

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
test("Extract FTSE 100 top 10 constituents by lowest percentage change", async ({
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
  await constituentsPage.sortByLowestChangePercent();
  const top10 = await constituentsPage.getTop10Rows();

  //Assertions
  // Should have exactly 10 rows
  expect(top10.length).toBe(10);
  console.log("Top 10 by lowest % change: ", top10);

  // Should not have empty values in key fields
  for (const row of top10) {
    expect(row.name).not.toBe("");
    expect(row.changePercent).not.toBe("");
  }

  // Should be correctly ordered in lowest value
  const percents = top10.map(row =>
    parseFloat(row.changePercent.replace("%", ""))
  );
  for (let i = 0; i < percents.length - 1; i++) {
    expect(percents[i]).toBeLessThanOrEqual(percents[i + 1]);
  }

  // Export to CSV
  exportToCSV(top10, "ftse100_lowest10constituents.csv");

  // Confirm CSV file exists
  expect(
    fs.existsSync(
      path.join(
        process.cwd(),
        "test-results",
        "ftse100_lowest10constituents.csv"
      )
    )
  ).toBe(true);
});
