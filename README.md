# KoinX - Tax Loss Harvesting Tool

A highly optimized and fully responsive Tax Loss Harvesting web application designed for KoinX. The application displays capital gains, lists asset holdings, calculates real-time "After Harvesting" gains when holdings are selected, and shows the exact amount of taxes saved.

## Deployed Link
https://koin-x-tawny-nine.vercel.app/

## Key Features

1. **Capital Gains Summary Cards**:
   - **Pre-Harvesting (Dark Mode)**: Renders STCG & LTCG profits, losses, net capital gains, and realized gains directly from the Capital Gains API.
   - **After Harvesting (Vibrant Blue)**: Simulates live calculations based on your selected assets from the holdings table.
2. **Real-time Savings Calculator**: Displays a success badge stating exactly how much tax you will save (e.g. `You're going to save ₹X`) when post-harvest gains are lower than pre-harvest gains.
3. **Interactive Holdings Table**:
   - Real-time checkboxes to select/deselect individual assets.
   - Master checkbox in the header to select/deselect all 25 assets.
   - Sortable columns (Asset Name, Current Price, Short-Term Gain, Long-Term Gain).
   - "Amount to Sell" field automatically populates with the full holding balance on asset selection.
   - **"View All" Expansion**: Gracefully shows the top 7 high-performance assets initially, with an option to expand and view all 25 holdings.
4. **Mock API Integration**:
   - Simulated fetch states with beautiful loading skeletons and full error-handling boundaries.
5. **Modern Visual Aesthetics**:
   - Premium gradient backgrounds, smooth micro-animations, curated harmonized colors (deep grays, bright blues, emerald green accents), and responsive layout.

---

## Tech Stack & Architecture

- **Framework**: React 18 with Vite + TypeScript
- **Styling**: Vanilla CSS Modules (modular, isolated, highly responsive)
- **State Management**: React Context API (`HarvestingContext` for central state management and selection tracking)
- **Mock Services**: Simulates async promises with mock latency (600ms to 800ms) to model real-world API requests.

---

## Installation & Setup

To run the application locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd KoinX
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```
