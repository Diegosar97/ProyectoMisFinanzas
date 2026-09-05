import React from 'react';
import { CreditCard, Smartphone, Banknote, Layers } from 'lucide-react';
import { formatCOP, formatUSD } from '../utils/formatters';

export const DineroCuentas = ({ monthData, trm, onUpdateMonth }) => {
  const cuentas = monthData?.cuentas || { nomina: 0, nequi: 0, efectivo: 0, otros: 0 };

  const totalCuentas = (Number(cuentas.nomina) || 0) +
                       (Number(cuentas.nequi) || 0) +
                       (Number(cuentas.efectivo) || 0) +
                       (Number(cuentas.otros) || 0);

  const handleAccountChange = (key, value) => {
    const numeric = Number(value) || 0;
    const updatedCuentas = {
      ...cuentas,
      [key]: numeric
    };
    onUpdateMonth({
      ...monthData,
      cuentas: updatedCuentas
    });
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CreditCard size={18} color="var(--accent-cyan)" /> Dinero Mes Actual por Cuentas
      </h3>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Distribución de tu dinero líquido disponible
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem', flex: 1 }}>
        
        {/* Nómina */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <CreditCard size={14} color="var(--primary-light)" />
            <span>Nómina $COP</span>
          </div>
          <input
            type="number"
            className="input-field"
            value={cuentas.nomina || ''}
            placeholder="0"
            onChange={(e) => handleAccountChange('nomina', e.target.value)}
          />
        </div>

        {/* Nequi */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <Smartphone size={14} color="var(--accent-purple)" />
            <span>Nequi $COP</span>
          </div>
          <input
            type="number"
            className="input-field"
            value={cuentas.nequi || ''}
            placeholder="0"
            onChange={(e) => handleAccountChange('nequi', e.target.value)}
          />
        </div>

        {/* Efectivo */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <Banknote size={14} color="var(--accent-emerald)" />
            <span>Efectivo $COP</span>
          </div>
          <input
            type="number"
            className="input-field"
            value={cuentas.efectivo || ''}
            placeholder="0"
            onChange={(e) => handleAccountChange('efectivo', e.target.value)}
          />
        </div>

        {/* Otros */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <Layers size={14} color="var(--accent-amber)" />
            <span>Otros $COP</span>
          </div>
          <input
            type="number"
            className="input-field"
            value={cuentas.otros || ''}
            placeholder="0"
            onChange={(e) => handleAccountChange('otros', e.target.value)}
          />
        </div>

      </div>

      {/* Total Dinero Cuentas */}
      <div style={{ marginTop: '1rem', padding: '0.7rem 1rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Total en Cuentas:</span>
        <span style={{ fontWeight: '800', fontSize: '1.15rem', color: 'var(--accent-cyan)' }}>
          {formatCOP(totalCuentas)} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>({formatUSD(totalCuentas, trm)})</span>
        </span>
      </div>

    </div>
  );
};
