import React, { useState, useEffect } from 'react';
import { dbService } from './services/dbService';
import { Header } from './components/Header';
import { KpiSummary } from './components/KpiSummary';
import { GastosTable } from './components/GastosTable';
import { ServiciosTable } from './components/ServiciosTable';
import { DineroCuentas } from './components/DineroCuentas';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { DatabaseModal } from './components/DatabaseModal';

export function App() {
  const [settings, setSettings] = useState(() => dbService.getSettings());
  const [allMonths, setAllMonths] = useState(() => dbService.getAllMonths());
  const [currentMonthId, setCurrentMonthId] = useState('2026-09');
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  // Synchronize document theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
  }, [settings.theme]);

  // Load and reload data helper
  const reloadData = () => {
    const freshSettings = dbService.getSettings();
    const freshMonths = dbService.getAllMonths();
    setSettings(freshSettings);
    setAllMonths(freshMonths);
    if (!freshMonths[currentMonthId]) {
      const keys = Object.keys(freshMonths);
      if (keys.length > 0) setCurrentMonthId(keys[keys.length - 1]);
    }
  };

  const currentMonthData = allMonths[currentMonthId] || null;

  const handleUpdateMonth = (updatedMonthData) => {
    const saved = dbService.saveMonth(updatedMonthData);
    setAllMonths(prev => ({
      ...prev,
      [saved.id]: saved
    }));
  };

  const handleUpdateSettings = (newSettings) => {
    dbService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleCreateNewMonth = () => {
    const today = new Date();
    const defaultNextLabel = `Mes ${Object.keys(allMonths).length + 1} (${today.toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })})`;
    const userLabel = window.prompt('Ingrese el nombre del nuevo mes:', defaultNextLabel);

    if (userLabel) {
      const newId = `month-${Date.now()}`;
      const created = dbService.createMonthFromTemplate(newId, userLabel.trim(), currentMonthId);
      setAllMonths(prev => ({
        ...prev,
        [created.id]: created
      }));
      setCurrentMonthId(created.id);
    }
  };

  if (!currentMonthData) {
    return (
      <div className="app-container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <h2>Cargando Dashboard Financiero...</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      
      {/* Header with Navigation & TRM */}
      <Header
        allMonths={allMonths}
        currentMonthId={currentMonthId}
        onSelectMonth={setCurrentMonthId}
        onCreateNewMonth={handleCreateNewMonth}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenDbModal={() => setIsDbModalOpen(true)}
      />

      {/* KPI Cards Summary */}
      <KpiSummary
        monthData={currentMonthData}
        trm={settings.trm_cop_usd}
        onUpdateMonth={handleUpdateMonth}
      />

      {/* Main Grid: Gastos Fijos vs Servicios */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '1.8rem',
        marginBottom: '1.8rem'
      }}>
        {/* Table 1: Gastos Fijos */}
        <GastosTable
          monthData={currentMonthData}
          trm={settings.trm_cop_usd}
          onUpdateMonth={handleUpdateMonth}
        />

        {/* Table 2: Servicios Breakdown */}
        <ServiciosTable
          monthData={currentMonthData}
          trm={settings.trm_cop_usd}
          onUpdateMonth={handleUpdateMonth}
        />
      </div>

      {/* Secondary Grid: Dinero en Cuentas & Analytics Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '1.8rem'
      }}>
        {/* Dinero Mes Actual */}
        <DineroCuentas
          monthData={currentMonthData}
          trm={settings.trm_cop_usd}
          onUpdateMonth={handleUpdateMonth}
        />

        {/* Charts & Analytics */}
        <AnalyticsCharts
          monthData={currentMonthData}
        />
      </div>

      {/* Database Modal */}
      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        onDataReload={reloadData}
      />

    </div>
  );
}

export default App;
