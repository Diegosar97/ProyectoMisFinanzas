import React from 'react';

export const CurrencyToggle = ({ currency, onChange, size = 'normal' }) => {
  return (
    <div style={{
      display: 'flex',
      background: 'var(--bg-input)',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
      flexShrink: 0
    }}>
      {['COP', 'USD'].map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          title={c === 'USD' ? 'Ingresar en dólares (USD)' : 'Ingresar en pesos (COP)'}
          style={{
            padding: size === 'small' ? '0.25rem 0.5rem' : '0.5rem 0.65rem',
            fontSize: size === 'small' ? '0.7rem' : '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: currency === c ? 'var(--primary)' : 'transparent',
            color: currency === c ? '#ffffff' : 'var(--text-muted)',
            transition: 'all var(--transition-fast)'
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
};