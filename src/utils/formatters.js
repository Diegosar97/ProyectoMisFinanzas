/**
 * Formateadores de Moneda (COP y USD)
 */

export const formatCOP = (amount) => {
  const numeric = Number(amount) || 0;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(numeric);
};

export const formatUSD = (amountInCOP, trm = 4000) => {
  const cop = Number(amountInCOP) || 0;
  const usd = trm > 0 ? cop / trm : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(usd);
};

export const parseCurrencyInput = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = val.toString().replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};
