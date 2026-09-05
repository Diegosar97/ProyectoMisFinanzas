import React, { useState } from 'react';
import { Wallet, Calendar, Plus, RefreshCw, Database, DollarSign, Moon, Sun } from 'lucide-react';
import { formatCOP, formatUSD } from '../utils/formatters';

export const Header = ({
  allMonths,
  currentMonthId,
  onSelectMonth,
  onCreateNewMonth,
  settings,
  onUpdateSettings,
  onOpenDbModal
}) => {
  const [showTrmPopover, setShowTrmPopover] = useState(false);
  const [quickCop, setQuickCop] = useState(100000);
  const [quickUsd, setQuickUsd] = useState(25);

  const monthKeys = Object.keys(allMonths).sort().reverse();

  const handleCopChange = (e) => {
    const val = Number(e.target.value) || 0;
    setQuickCop(val);
    setQuickUsd(settings.trm_cop_usd ? Number((val / settings.trm_cop_usd).toFixed(2)) : 0);
  };

  const handleUsdChange = (e) => {
    const val = Number(e.target.value) || 0;
    setQuickUsd(val);
    setQuickCop(Math.round(val * settings.trm_cop_usd));
  };

  const handleTrmChange = (e) => {
    const newTrm = Number(e.target.value) || 1;
    onUpdateSettings({ ...settings, trm_cop_usd: newTrm });
    setQuickUsd(Number((quickCop / newTrm).toFixed(2)));
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ ...settings, theme: newTheme });
  };

  return (
    <header className="glass-card" style={{ padding: '1.2rem 1.8rem', marginBottom: '1.8rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.2rem' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
            padding: '0.65rem',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Wallet size={26} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', margin: 0, background: 'linear-gradient(90deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Mis Finanzas
            </h1>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Dashboard de Gastos & Presupuesto</span>
          </div>
        </div>

        {/* Month Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.35rem 0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <Calendar size={18} color="var(--primary-light)" />
            <select
              value={currentMonthId}
              onChange={(e) => onSelectMonth(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-heading)',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {monthKeys.map((mKey) => (
                <option key={mKey} value={mKey} style={{ background: '#121a2c', color: '#fff' }}>
                  {allMonths[mKey].label || mKey}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn-primary"
            onClick={onCreateNewMonth}
            title="Crear un nuevo mes duplicando gastos fijos desmarcados"
          >
            <Plus size={18} />
            <span>Nuevo Mes</span>
          </button>
        </div>

        {/* Currency & DB Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* TRM Converter Popover Button */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn-secondary"
              onClick={() => setShowTrmPopover(!showTrmPopover)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <DollarSign size={16} color="var(--accent-emerald)" />
              <span>TRM: {formatCOP(settings.trm_cop_usd)}</span>
            </button>

            {showTrmPopover && (
              <div className="glass-card animate-fade-in" style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                width: '310px',
                padding: '1.2rem',
                zIndex: 100,
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <RefreshCw size={16} color="var(--accent-cyan)" /> Conversión Bidireccional COP / USD
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Tasa TRM (1 USD en COP):</label>
                    <input
                      type="number"
                      className="input-field"
                      value={settings.trm_cop_usd}
                      onChange={handleTrmChange}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Monto $COP:</label>
                      <input
                        type="number"
                        className="input-field"
                        value={quickCop}
                        onChange={handleCopChange}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Monto $USD:</label>
                      <input
                        type="number"
                        className="input-field"
                        value={quickUsd}
                        onChange={handleUsdChange}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', textAlign: 'center', marginTop: '0.3rem' }}>
                    {formatCOP(quickCop)} ≈ {formatUSD(quickCop, settings.trm_cop_usd)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Database JSON Modal Trigger */}
          <button
            className="btn-secondary"
            onClick={onOpenDbModal}
            title="Base de datos local JSON (Exportar / Importar / Copia de seguridad)"
          >
            <Database size={16} color="var(--accent-purple)" />
            <span>BD NoSQL</span>
          </button>

          {/* Theme Toggle */}
          <button
            className="btn-secondary"
            onClick={toggleTheme}
            style={{ padding: '0.6rem' }}
            title="Cambiar tema claro/oscuro"
          >
            {settings.theme === 'dark' ? <Sun size={18} color="var(--accent-amber)" /> : <Moon size={18} color="var(--primary)" />}
          </button>

        </div>

      </div>
    </header>
  );
};
