import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { formatCOP } from '../utils/formatters';

const COLOR_PALETTE = [
  '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#a855f7', '#3b82f6', '#84cc16'
];

export const AnalyticsCharts = ({ monthData }) => {
  const gastos = monthData?.gastos || [];

  const chartData = gastos.map((g, idx) => ({
    name: g.title,
    value: Number(g.amount) || 0,
    paid: g.paid,
    color: COLOR_PALETTE[idx % COLOR_PALETTE.length]
  })).filter(d => d.value > 0);

  const totalGastos = chartData.reduce((acc, d) => acc + d.value, 0);
  const totalPagado = chartData.filter(d => d.paid).reduce((acc, d) => acc + d.value, 0);
  const porcentaje = totalGastos > 0 ? Math.round((totalPagado / totalGastos) * 100) : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: '#121a2c', border: '1px solid rgba(255,255,255,0.15)', padding: '0.6rem 0.9rem', borderRadius: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{data.name}</div>
          <div style={{ color: data.color, fontWeight: 800, fontSize: '0.95rem' }}>{formatCOP(data.value)}</div>
          <div style={{ fontSize: '0.75rem', color: data.paid ? 'var(--success)' : 'var(--warning)', marginTop: '0.2rem' }}>
            {data.paid ? '✓ Pagado' : '⏳ Pendiente'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <PieIcon size={18} color="var(--accent-purple)" /> Análisis de Distribución de Gastos
      </h3>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Proporción de presupuesto por cada rubro
      </p>

      {/* Progress Bar */}
      <div style={{ marginBottom: '1.2rem', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BarChart3 size={14} color="var(--success)" /> Cumplimiento de Pagos
          </span>
          <span style={{ fontWeight: 800, color: 'var(--success)' }}>{porcentaje}% Pagado</span>
        </div>
        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${porcentaje}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--success), var(--accent-cyan))',
              borderRadius: '999px',
              transition: 'width 0.5s ease-out'
            }}
          />
        </div>
      </div>

      {/* Donut Chart */}
      <div style={{ width: '100%', height: '230px', flex: 1, minHeight: '200px' }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            Sin datos de gastos para graficar
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 0.8rem', marginTop: '0.8rem', justifyContent: 'center' }}>
        {chartData.map((item) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>

    </div>
  );
};
