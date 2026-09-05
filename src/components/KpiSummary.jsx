import React from 'react';
import { DollarSign, CheckCircle2, Clock, Wallet, PiggyBank, ArrowUpRight, TrendingDown } from 'lucide-react';
import { formatCOP, formatUSD } from '../utils/formatters';

export const KpiSummary = ({ monthData, trm, onUpdateMonth }) => {
  if (!monthData) return null;

  const sueldo = Number(monthData.sueldo) || 0;
  const extra = Number(monthData.extra) || 0;
  const ingresoTotal = sueldo + extra;

  // Gastos
  const gastos = monthData.gastos || [];
  const pagados = gastos.filter(g => g.paid).reduce((acc, g) => acc + (Number(g.amount) || 0), 0);
  const pendientes = gastos.filter(g => !g.paid).reduce((acc, g) => acc + (Number(g.amount) || 0), 0);
  const totalGastos = pagados + pendientes;

  // Saldo Actual = Ingreso Total - Pagados
  const saldoActual = ingresoTotal - pagados;

  // Saldo Esperado = Saldo Actual - Pendientes = Ingreso Total - Total Gastos
  const saldoEsperado = saldoActual - pendientes;

  const ahorroMeta = Number(monthData.ahorro_meta) || 0;
  const ahorroPaid = monthData.ahorro_paid || false;

  const handleSueldoChange = (e) => {
    const val = Number(e.target.value) || 0;
    onUpdateMonth({ ...monthData, sueldo: val });
  };

  const handleExtraChange = (e) => {
    const val = Number(e.target.value) || 0;
    onUpdateMonth({ ...monthData, extra: val });
  };

  const handleAhorroMetaChange = (e) => {
    const val = Number(e.target.value) || 0;
    onUpdateMonth({ ...monthData, ahorro_meta: val });
  };

  const toggleAhorroPaid = () => {
    onUpdateMonth({ ...monthData, ahorro_paid: !ahorroPaid });
  };

  const percentPaid = totalGastos > 0 ? Math.round((pagados / totalGastos) * 100) : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.2rem', marginBottom: '1.8rem' }}>
      
      {/* Ingresos / Sueldo */}
      <div className="glass-card" style={{ padding: '1.2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Ingresos Totales</span>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.4rem', borderRadius: '10px' }}>
            <Wallet size={20} color="var(--primary-light)" />
          </div>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
          {formatCOP(ingresoTotal)}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {formatUSD(ingresoTotal, trm)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>Sueldo Base:</span>
            <input
              type="number"
              className="input-field"
              value={sueldo}
              onChange={handleSueldoChange}
              style={{ padding: '0.25rem 0.4rem', fontSize: '0.8rem' }}
            />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>Ingreso Extra:</span>
            <input
              type="number"
              className="input-field"
              value={extra}
              onChange={handleExtraChange}
              style={{ padding: '0.25rem 0.4rem', fontSize: '0.8rem' }}
            />
          </div>
        </div>
      </div>

      {/* Pagados */}
      <div className="glass-card" style={{ padding: '1.2rem', borderColor: 'var(--success-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Gastos Pagados</span>
          <div style={{ background: 'var(--success-bg)', padding: '0.4rem', borderRadius: '10px' }}>
            <CheckCircle2 size={20} color="var(--success)" />
          </div>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.03em' }}>
          {formatCOP(pagados)}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {formatUSD(pagados, trm)}
        </div>

        <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avance de Pagos:</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--success)' }}>{percentPaid}%</span>
        </div>
      </div>

      {/* Pendientes */}
      <div className="glass-card" style={{ padding: '1.2rem', borderColor: 'var(--warning-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Gastos Pendientes</span>
          <div style={{ background: 'var(--warning-bg)', padding: '0.4rem', borderRadius: '10px' }}>
            <Clock size={20} color="var(--warning)" />
          </div>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)', letterSpacing: '-0.03em' }}>
          {formatCOP(pendientes)}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {formatUSD(pendientes, trm)}
        </div>

        <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          {gastos.filter(g => !g.paid).length} rubro(s) por pagar
        </div>
      </div>

      {/* Saldo Actual */}
      <div className="glass-card" style={{ padding: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Saldo Actual disponible</span>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.4rem', borderRadius: '10px' }}>
            <DollarSign size={20} color="var(--accent-amber)" />
          </div>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', letterSpacing: '-0.03em' }}>
          {formatCOP(saldoActual)}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {formatUSD(saldoActual, trm)}
        </div>
        <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Ingresos menos lo ya pagado
        </div>
      </div>

      {/* Saldo Esperado */}
      <div className="glass-card" style={{ padding: '1.2rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Saldo Esperado a Fin de Mes</span>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.4rem', borderRadius: '10px' }}>
            <ArrowUpRight size={20} color="var(--accent-emerald)" />
          </div>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
          {formatCOP(saldoEsperado)}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {formatUSD(saldoEsperado, trm)}
        </div>
        <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
          Libre tras cubrir todos los gastos
        </div>
      </div>

      {/* Meta de Ahorro */}
      <div className="glass-card" style={{ padding: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Meta de Ahorro</span>
          <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '0.4rem', borderRadius: '10px' }}>
            <PiggyBank size={20} color="var(--accent-purple)" />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '0.2rem 0' }}>
          <div
            className={`custom-checkbox ${ahorroPaid ? 'checked' : ''}`}
            onClick={toggleAhorroPaid}
            title={ahorroPaid ? 'Ahorro Cumplido' : 'Marcar Ahorro como Realizado'}
          >
            {ahorroPaid && <CheckCircle2 size={16} color="#fff" />}
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: ahorroPaid ? 'var(--success)' : 'var(--text-main)' }}>
            {formatCOP(ahorroMeta)}
          </div>
        </div>

        <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.2rem' }}>Monto Ahorro:</span>
          <input
            type="number"
            className="input-field"
            value={ahorroMeta}
            onChange={handleAhorroMetaChange}
            style={{ padding: '0.25rem 0.4rem', fontSize: '0.8rem' }}
          />
        </div>
      </div>

    </div>
  );
};
