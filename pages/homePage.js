export class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.acceptCookiesButton = page.getByRole("button", {
      name: /Accept All Cookies/i,
    });
    this.ftse100Link = page.getByRole("link", { name: "View FTSE 100" });
  }

  async goto() {
    await this.page.goto("https://www.londonstockexchange.com/");
    await this.page.waitForLoadState("networkidle");
  }

  async acceptCookiesIfVisible() {
    try {
      if (await this.acceptCookiesButton.isVisible({ timeout: 5000 })) {
        await this.acceptCookiesButton.click();
      }
    } catch (e) {
      // Assumes cookies already accepted
    }
  }

  async openFTSE100Constituents() {
    await this.ftse100Link.waitFor({ state: "visible", timeout: 10000 });
    const [newPage] = await Promise.all([
      this.page.waitForEvent("popup", { timeout: 10000 }),
      this.ftse100Link.click(),
    ]);

    // Make sure page has loaded
    return newPage;
  }
}
