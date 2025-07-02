export class ConstituentsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.table = page.locator("table");
    this.changeHeader = page.locator(
      'th.percentualchange:has-text("Change %")'
    );
    this.sortHighestOption = page.locator(
      '.dropmenu.dropdown.expanded li.sort-option div[title="Highest – lowest"]'
    );
    this.sortLowestOption = page.locator(
      '.dropmenu.dropdown.expanded li.sort-option div[title="Lowest – highest"]'
    );
    this.rows = page.locator("tbody tr");
  }

  async waitForLoad() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.table.waitFor({ state: "visible", timeout: 15000 });
  }

  async sortByHighestChangePercent() {
    await this.changeHeader.waitFor({ state: "visible", timeout: 10000 });
    await this.changeHeader.click();
    await this.sortHighestOption.waitFor({ state: "visible", timeout: 10000 });
    await Promise.all([
      this.page.waitForResponse(
        response =>
          response.url().includes("/api/v1/components/refresh") &&
          response.status() === 200
      ),
      this.sortHighestOption.click(),
    ]);
  }

  async sortByLowestChangePercent() {
    await this.changeHeader.waitFor({ state: "visible", timeout: 10000 });
    await this.changeHeader.click();
    await this.sortLowestOption.waitFor({ state: "visible", timeout: 10000 });
    await Promise.all([
      this.page.waitForResponse(
        response =>
          response.url().includes("/api/v1/components/refresh") &&
          response.status() === 200
      ),
      this.sortLowestOption.click(),
    ]);
  }

  async getTop10Rows() {
    await this.rows.first().waitFor({ state: "visible", timeout: 10000 });
    const top10 = [];
    for (let i = 0; i < 10; i++) {
      const row = this.rows.nth(i);
      const code = await row.locator("td").nth(0).innerText();
      const name = await row.locator("td").nth(1).innerText();
      const currency = await row.locator("td").nth(2).innerText();
      const marketCap = await row.locator("td").nth(3).innerText();
      const price = await row.locator("td").nth(4).innerText();
      const change = await row.locator("td").nth(5).innerText();
      const changePercent = await row.locator("td").nth(6).innerText();
      top10.push({
        code,
        name,
        currency,
        marketCap,
        price,
        change,
        changePercent,
      });
    }
    return top10;
  }
}
