# LondonStockExchangeTest

This project contains automated Playwright tests for the London Stock Exchange website, focusing on extracting and validating FTSE 100 constituents and index data.

## Features

- Extracts table data for FTSE 100 constituents, including code, name, currency, market cap, price, change, and change percent.
- Supports sorting and pagination.
- Validates data against CSV exports.
- Robust waiting and error handling for dynamic content.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)
- Chrome, Firefox, or WebKit browsers (Playwright will install these automatically)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/GBDavies/LondonStockExchangeTest/
   cd LondonStockExchangeTest
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Install Playwright browsers:
   ```sh
   npx playwright install
   ```

### Running Tests

To run all tests:

```sh
npx playwright test
```

To run a specific test file:

```sh
npx playwright test tests/lowest-average-index-over-last-3-years.spec.js
```

### Project Structure

- `pages/constituentsPage.js` – Page object for the FTSE 100 constituents table.
- `tests/` – Contains all test files.
- `playwright.config.js` – Playwright configuration.

### Key Design Decisions

- **Page Object Model:** Encapsulates selectors and actions for maintainability and reusability.
- **Dynamic Pagination Handling:** Automatically detects and iterates through all available pages.
- **Robust Selectors:** Uses a combination of class names and visible text for element targeting.
- **Wait Strategies:** Waits for both DOM content and specific elements to ensure reliability.

### Notes & Limitations

- Selectors rely on visible text and class names; if the site structure or language changes, updates may be required.
- For maximum robustness, consider working with developers to add stable data attributes to key elements.
- Tests are designed for the English version of the site.

### Troubleshooting

- If tests are flaky, check your network connection and consider increasing timeouts in `constituentsPage.js`.
- Ensure all dependencies and browsers are installed.

### Contributing

---

**Author:**  
Gareth Bentir-Davies

**Date:** July 2025
