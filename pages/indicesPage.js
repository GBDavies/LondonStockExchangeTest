export class IndicesPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.intradayTable = page.locator("#indices-table-IntradayValues");
    this.intradayTableRow = page.locator(
      "#indices-table-IntradayValues tbody tr"
    );
    this.ftse100Link = page.locator('a.dash-link[href="indices/ftse-100"]');
    this.chartContainer = page.locator(".highcharts-container");
    this.yearInput = page.locator(
      'input[placeholder="YYYY"][aria-label="Year in from date"]'
    );
    this.periodicityDropdown = page.locator(
      ".periodicity-select button.dropdown-toggle"
    );
    this.monthlyOption = page.locator(".dropdown-item", { hasText: "Monthly" });
    this.pointsLocator = page.locator(".highcharts-point[aria-label]");
  }

  //With more time, I would create a reusable retry logic instead of having long timeouts
  async waitForLoad() {
    await this.page.waitForLoadState("domcontentloaded", { timeout: 15000 });
    await this.intradayTable.waitFor({ state: "visible", timeout: 15000 });
    await this.intradayTableRow
      .first()
      .waitFor({ state: "visible", timeout: 10000 });
  }

  async openFTSE100Index() {
    await this.ftse100Link.click();
    await this.chartContainer.waitFor({ state: "visible", timeout: 10000 });
  }

  async setYearFrom(year) {
    await this.yearInput.fill(year.toString());
    await Promise.all([
      this.page.waitForResponse(
        response =>
          response.url().includes("rest/api/timeseries/historical?ric=.FTSE") &&
          response.status() === 200
      ),
      this.yearInput.press("Enter"),
    ]);
  }

  // Wait For Response step has been flaky - Could add retry logic
  async setPeriodicityToMonthly() {
    await this.periodicityDropdown.click();
    await this.monthlyOption.waitFor({ state: "visible", timeout: 5000 });
    await Promise.all([
      this.page.waitForResponse(
        response =>
          response.url().includes("rest/api/timeseries/historical?ric=.FTSE") &&
          response.status() === 200
      ),
      this.monthlyOption.click(),
    ]);
    await this.chartContainer.waitFor({ state: "visible", timeout: 15000 });
  }

  async getMonthlyPoints() {
    await this.pointsLocator
      .first()
      .waitFor({ state: "visible", timeout: 15000 });
    return await this.pointsLocator.all();
  }

  //Alternative option: Call Get https://refinitiv-widgets.financial.com/rest/api/timeseries/historical?ric=.FTSE API and calculate lowest average
}
