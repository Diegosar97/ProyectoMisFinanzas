import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, CheckCircle2, AlertCircle, Link, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCOP, formatUSD } from '../utils/formatters';
import { CurrencyToggle } from './CurrencyToggle';

export const GastosTable = ({ monthData, trm, onUpdateMonth }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCurrency, setNewCurrency] = useState('COP');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCurrency, setEditCurrency] = useState('COP');

  const gastos = monthData?.gastos || [];

  const totalGastos = gastos.reduce((acc, g) => acc + (Number(g.amount) || 0), 0);
  const pagadosTotal = gastos.filter(g => g.paid).reduce((acc, g) => acc + (Number(g.amount) || 0), 0);
  const pendientesTotal = totalGastos - pagadosTotal;

  const handleTogglePaid = (id) => {
    const updated = gastos.map(g => {
      if (g.id === id) {
        const nextPaid = !g.paid;
        if (nextPaid) {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
        return { ...g, paid: nextPaid };
      }
      return g;
    });
    onUpdateMonth({ ...monthData, gastos: updated });
  };

  const handleAddGasto = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem = {
      id: `g-${Date.now()}`,
      title: newTitle.trim(),
      amount: newCurrency === 'USD' ? Math.round((Number(newAmount) || 0) * trm) : (Number(newAmount) || 0),
      paid: false,
      is_linked_servicios: false
    };

    onUpdateMonth({
      ...monthData,
      gastos: [...gastos, newItem]
    });

    setNewTitle('');
    setNewAmount('');
  };

  const handleDeleteGasto = (id) => {
    const updated = gastos.filter(g => g.id !== id);
    onUpdateMonth({ ...monthData, gastos: updated });
  };

  const startEdit = (gasto) => {
    setEditingId(gasto.id);
    setEditTitle(gasto.title);
    setEditAmount(gasto.amount);
    setEditCurrency('COP');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id) => {
    const updated = gastos.map(g => {
      if (g.id === id) {
        return {
          ...g,
          title: editTitle.trim() || g.title,
          amount: editCurrency === 'USD' ? Math.round((Number(editAmount) || 0) * trm) : (Number(editAmount) || 0)
        };
      }
      return g;
    });
    onUpdateMonth({ ...monthData, gastos: updated });
    setEditingId(null);
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Gastos Fijos Mensuales
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Marca los pagos realizados mes a mes
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <span className="badge badge-paid">
            Pagados: {formatCOP(pagadosTotal)}
          </span>
          <span className="badge badge-pending">
            Pendientes: {formatCOP(pendientesTotal)}
          </span>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
          <thead>
            <tr style={{ color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem 0.8rem', width: '50px' }}>Estado</th>
              <th style={{ padding: '0.5rem 0.8rem' }}>Concepto</th>
              <th style={{ padding: '0.5rem 0.8rem', textAlign: 'right' }}>Monto ($COP)</th>
              <th style={{ padding: '0.5rem 0.8rem', textAlign: 'right' }}>$USD</th>
              <th style={{ padding: '0.5rem 0.8rem', textAlign: 'center', width: '90px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((gasto) => {
              const isEditing = editingId === gasto.id;
              const isLinked = gasto.is_linked_servicios || gasto.title.toLowerCase() === 'mi casita';

              return (
                <tr
                  key={gasto.id}
                  style={{
                    background: gasto.paid ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '10px',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {/* Checkbox */}
                  <td style={{ padding: '0.75rem 0.8rem', borderRadius: '10px 0 0 10px' }}>
                    <div
                      className={`custom-checkbox ${gasto.paid ? 'checked' : ''}`}
                      onClick={() => handleTogglePaid(gasto.id)}
                      title={gasto.paid ? 'Marcar como pendiente' : 'Marcar como pagado'}
                    >
                      {gasto.paid && <CheckCircle2 size={16} color="#ffffff" />}
                    </div>
                  </td>

                  {/* Title */}
                  <td style={{ padding: '0.75rem 0.8rem' }}>
                    {isEditing ? (
                      <input
                        type="text"
                        className="input-field"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        disabled={isLinked}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          fontWeight: '600',
                          fontSize: '0.95rem',
                          color: gasto.paid ? 'var(--text-muted)' : 'var(--text-main)',
                          textDecoration: gasto.paid ? 'line-through' : 'none'
                        }}>
                          {gasto.title}
                        </span>
                        {isLinked && (
                          <span style={{
                            fontSize: '0.7rem',
                            background: 'rgba(6, 182, 212, 0.15)',
                            color: 'var(--accent-cyan)',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }} title="Auto-calculado desde la tabla Servicios">
                            <Link size={10} /> Auto-Servicios
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Amount COP */}
                  <td style={{ padding: '0.75rem 0.8rem', textAlign: 'right', fontWeight: '700', fontSize: '0.95rem' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'column', gap: '0.3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <input
                            type="number"
                            className="input-field"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            disabled={isLinked}
                            style={{ textAlign: 'right', maxWidth: '120px' }}
                          />
                          {!isLinked && (
                            <CurrencyToggle currency={editCurrency} onChange={setEditCurrency} size="small" />
                          )}
                        </div>
                        {!isLinked && Number(editAmount) > 0 && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {editCurrency === 'USD'
                              ? `≈ ${formatCOP(Math.round((Number(editAmount) || 0) * trm))}`
                              : `≈ ${formatUSD(editAmount, trm)}`}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: gasto.paid ? 'var(--success)' : 'var(--text-main)' }}>
                        {formatCOP(gasto.amount)}
                      </span>
                    )}
                  </td>

                  {/* Amount USD */}
                  <td style={{ padding: '0.75rem 0.8rem', textAlign: 'right', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {formatUSD(gasto.amount, trm)}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '0.75rem 0.8rem', textAlign: 'center', borderRadius: '0 10px 10px 0' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center' }}>
                        <button className="btn-secondary" style={{ padding: '0.3rem' }} onClick={() => saveEdit(gasto.id)} title="Guardar">
                          <Check size={14} color="var(--success)" />
                        </button>
                        <button className="btn-secondary" style={{ padding: '0.3rem' }} onClick={cancelEdit} title="Cancelar">
                          <X size={14} color="var(--warning)" />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center' }}>
                        {!isLinked && (
                          <button className="btn-secondary" style={{ padding: '0.35rem' }} onClick={() => startEdit(gasto)} title="Editar">
                            <Edit2 size={14} color="var(--text-muted)" />
                          </button>
                        )}
                        {!isLinked && (
                          <button className="btn-secondary" style={{ padding: '0.35rem' }} onClick={() => handleDeleteGasto(gasto.id)} title="Eliminar">
                            <Trash2 size={14} color="var(--warning)" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add New Gasto Form */}
      <form onSubmit={handleAddGasto} style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '2fr 1.4fr auto', gap: '0.6rem', alignItems: 'center' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Nuevo gasto (ej. Gimnasio)"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <input
              type="number"
              className="input-field"
              placeholder={newCurrency === 'USD' ? 'Monto $USD' : 'Monto $COP'}
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
            <CurrencyToggle currency={newCurrency} onChange={setNewCurrency} />
          </div>
          {Number(newAmount) > 0 && (
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '0.3rem' }}>
              {newCurrency === 'USD'
                ? `≈ ${formatCOP(Math.round((Number(newAmount) || 0) * trm))}`
                : `≈ ${formatUSD(newAmount, trm)}`}
            </div>
          )}
        </div>
        <button type="submit" className="btn-primary" style={{ padding: '0.6rem 0.9rem' }}>
          <Plus size={16} /> Agregar
        </button>
      </form>

      {/* Total Footer */}
      <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.8rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Total Gastos Fijos:</span>
        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary-light)' }}>
          {formatCOP(totalGastos)} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>({formatUSD(totalGastos, trm)})</span>
        </span>
      </div>

    </div>
  );
};
