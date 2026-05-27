# Border Crossing Analytics Frontend

This is the Next.js React frontend for the **Border Crossing & Trade Logistics Analytics Platform**, built with Tailwind CSS, Lucide icons, and Recharts.

---

## 🛠️ Main Libraries Used

- **Framework**: [Next.js](https://nextjs.org/) (version 16.2.4) using Turbopack
- **Charts**: [Recharts](https://recharts.org/) (for BarCharts, LineCharts, and legends)
- **Icons**: [Lucide React](https://lucide.dev/) (for clean vector UI indicators)
- **Styling**: Tailwind CSS (v4) for full visual layout styling

---

## 🏃 Running the Frontend

First, ensure the FastAPI backend is running on `http://localhost:5000` (since API requests are fetched client-side).

Launch the Next.js Turbopack development server on port 3000:
```bash
npx next dev -p 3000
```
Then, open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Component Architecture

- **`src/app/page.tsx`**: Main entrypoint importing the dashboard.
- **`src/components/Dashboard.tsx`**: Main visual orchestrator handling selection states and layout grids.
- **`src/components/BorderMap.tsx`**: Custom SVG border layout with interactive port hotspots.
- **`src/components/CrossingCompare.tsx`**: Side-by-side dropdown selectors and specs grid comparing selected ports.
- **`src/components/CommodityFlows.tsx`**: Horizontal progress chart representing global commodity flow splits.
- **`src/components/HistoricalTrends.tsx`**: Dual-axis line chart mapping transit delays against vehicle flow throughput.

---

## 🧪 E2E Selenium Testing

We use **Jest** and **Selenium WebDriver** to verify dashboard rendering and headless Chrome interaction.

### Commands

1. **Verify E2E Tests**:
   ```bash
   npm run test:e2e
   ```
2. **Configuration file**:
   Check `jest.e2e.config.js` or `__tests__/e2e/dashboard.test.js` to customize test timeout or ChromeDriver launch arguments.
