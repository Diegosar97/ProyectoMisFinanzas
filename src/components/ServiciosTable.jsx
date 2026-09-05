import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, CheckCircle2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCOP, formatUSD } from '../utils/formatters';
import { CurrencyToggle } from './CurrencyToggle';

export const ServiciosTable = ({ monthData, trm, onUpdateMonth }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCurrency, setNewCurrency] = useState('COP');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCurrency, setEditCurrency] = useState('COP');

  const servicios = monthData?.servicios || [];

  const totalServicios = servicios.reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
  const pagadosTotal = servicios.filter(s => s.paid).reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
  const pendientesTotal = totalServicios - pagadosTotal;

  const handleTogglePaid = (id) => {
    const updated = servicios.map(s => {
      if (s.id === id) {
        const nextPaid = !s.paid;
        if (nextPaid) {
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.7 }
          });
        }
        return { ...s, paid: nextPaid };
      }
      return s;
    });

    onUpdateMonth({ ...monthData, servicios: updated });
  };

  const handleAddServicio = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem = {
      id: `s-${Date.now()}`,
      title: newTitle.trim(),
      amount: newCurrency === 'USD' ? Math.round((Number(newAmount) || 0) * trm) : (Number(newAmount) || 0),
      paid: false
    };

    onUpdateMonth({
      ...monthData,
      servicios: [...servicios, newItem]
    });

    setNewTitle('');
    setNewAmount('');
  };

  const handleDeleteServicio = (id) => {
    const updated = servicios.filter(s => s.id !== id);
    onUpdateMonth({ ...monthData, servicios: updated });
  };

  const startEdit = (servicio) => {
    setEditingId(servicio.id);
    setEditTitle(servicio.title);
    setEditAmount(servicio.amount);
    setEditCurrency('COP');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id) => {
    const updated = servicios.map(s => {
      if (s.id === id) {
        return {
          ...s,
          title: editTitle.trim() || s.title,
          amount: editCurrency === 'USD' ? Math.round((Number(editAmount) || 0) * trm) : (Number(editAmount) || 0)
        };
      }
      return s;
    });
    onUpdateMonth({ ...monthData, servicios: updated });
    setEditingId(null);
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} color="var(--accent-amber)" /> Servicios ("Mi Casita")
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Sincronizado automáticamente con Gastos Fijos
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
              <th style={{ padding: '0.5rem 0.8rem' }}>Servicio</th>
              <th style={{ padding: '0.5rem 0.8rem', textAlign: 'right' }}>Monto ($COP)</th>
              <th style={{ padding: '0.5rem 0.8rem', textAlign: 'right' }}>$USD</th>
              <th style={{ padding: '0.5rem 0.8rem', textAlign: 'center', width: '90px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((servicio) => {
              const isEditing = editingId === servicio.id;

              return (
                <tr
                  key={servicio.id}
                  style={{
                    background: servicio.paid ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '10px',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {/* Checkbox */}
                  <td style={{ padding: '0.75rem 0.8rem', borderRadius: '10px 0 0 10px' }}>
                    <div
                      className={`custom-checkbox ${servicio.paid ? 'checked' : ''}`}
                      onClick={() => handleTogglePaid(servicio.id)}
                      title={servicio.paid ? 'Marcar como pendiente' : 'Marcar como pagado'}
                    >
                      {servicio.paid && <CheckCircle2 size={16} color="#ffffff" />}
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
                      />
                    ) : (
                      <span style={{
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        color: servicio.paid ? 'var(--text-muted)' : 'var(--text-main)',
                        textDecoration: servicio.paid ? 'line-through' : 'none'
                      }}>
                        {servicio.title}
                      </span>
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
                            style={{ textAlign: 'right', maxWidth: '120px' }}
                          />
                          <CurrencyToggle currency={editCurrency} onChange={setEditCurrency} size="small" />
                        </div>
                        {Number(editAmount) > 0 && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {editCurrency === 'USD'
                              ? `≈ ${formatCOP(Math.round((Number(editAmount) || 0) * trm))}`
                              : `≈ ${formatUSD(editAmount, trm)}`}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: servicio.paid ? 'var(--success)' : 'var(--text-main)' }}>
                        {formatCOP(servicio.amount)}
                      </span>
                    )}
                  </td>

                  {/* Amount USD */}
                  <td style={{ padding: '0.75rem 0.8rem', textAlign: 'right', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {formatUSD(servicio.amount, trm)}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '0.75rem 0.8rem', textAlign: 'center', borderRadius: '0 10px 10px 0' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center' }}>
                        <button className="btn-secondary" style={{ padding: '0.3rem' }} onClick={() => saveEdit(servicio.id)} title="Guardar">
                          <Check size={14} color="var(--success)" />
                        </button>
                        <button className="btn-secondary" style={{ padding: '0.3rem' }} onClick={cancelEdit} title="Cancelar">
                          <X size={14} color="var(--warning)" />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center' }}>
                        <button className="btn-secondary" style={{ padding: '0.35rem' }} onClick={() => startEdit(servicio)} title="Editar">
                          <Edit2 size={14} color="var(--text-muted)" />
                        </button>
                        <button className="btn-secondary" style={{ padding: '0.35rem' }} onClick={() => handleDeleteServicio(servicio.id)} title="Eliminar">
                          <Trash2 size={14} color="var(--warning)" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add New Servicio Form */}
      <form onSubmit={handleAddServicio} style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '2fr 1.4fr auto', gap: '0.6rem', alignItems: 'center' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Nuevo servicio (ej. Gas)"
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
      <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.8rem', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Total Servicios ("Mi Casita"):</span>
        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--accent-amber)' }}>
          {formatCOP(totalServicios)} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>({formatUSD(totalServicios, trm)})</span>
        </span>
      </div>

    </div>
  );
};
