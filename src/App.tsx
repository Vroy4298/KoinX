import { HarvestingProvider, useHarvesting } from './context/HarvestingContext';
import CapitalGainsCard from './components/CapitalGainsCard/CapitalGainsCard';
import HoldingsTable from './components/HoldingsTable/HoldingsTable';
import InfoBanner from './components/InfoBanner/InfoBanner';
import './App.css';

function AppContent() {
  const { preHarvesting, afterHarvesting, gainsLoading, gainsError } = useHarvesting();

  return (
    <div className="appContainer">
      <header className="header">
        <div className="logoWrapper">
          <svg className="logoSvg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#2563EB" />
            <path d="M2 17L12 22L22 17" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="logoText">Koin<span className="logoAccent">X</span></span>
        </div>
        <div className="titleSection">
          <h1 className="mainTitle">Tax Loss Harvesting Optimizer</h1>
          <p className="subtitle">Simulate sales and offset capital gains to minimize taxes</p>
        </div>
      </header>

      <main className="mainContent">
        <InfoBanner />

        {gainsLoading ? (
          <div className="cardLoader">
            <div className="spinner"></div>
            <p>Analyzing capital gains history...</p>
          </div>
        ) : gainsError ? (
          <div className="errorBanner">⚠️ {gainsError}</div>
        ) : (
          <div className="cardsGrid">
            {preHarvesting && <CapitalGainsCard variant="pre" data={preHarvesting} />}
            {afterHarvesting && <CapitalGainsCard variant="after" data={afterHarvesting} />}
          </div>
        )}

        <HoldingsTable />
      </main>

      <footer className="footer">
        <p>© 2026 KoinX. Built for Frontend Engineering Assignment.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HarvestingProvider>
      <AppContent />
    </HarvestingProvider>
  );
}
