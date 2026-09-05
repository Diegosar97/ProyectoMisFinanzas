/**
 * Servicio de Base de Datos Local NoSQL (Document Store)
 * Maneja colecciones de 'months' y 'settings' guardados en LocalStorage/JSON.
 */

const STORAGE_KEY_MONTHS = 'mis_finanzas_nosql_months';
const STORAGE_KEY_SETTINGS = 'mis_finanzas_nosql_settings';

// Datos iniciales de semilla basados exactamente en la hoja de Excel compartida
const INITIAL_SEED_MONTH = {
  id: '2026-09',
  label: 'Septiembre 2026',
  sueldo: 5000000,
  extra: 0,
  ahorro_meta: 500000,
  ahorro_paid: false,
  cuentas: {
    nomina: 0,
    nequi: 0,
    efectivo: 0,
    otros: 0,
  },
  gastos: [
    { id: 'g-1', title: 'Padres', amount: 100000, paid: true, is_linked_servicios: false },
    { id: 'g-2', title: 'Mi casita', amount: 603000, paid: false, is_linked_servicios: true },
    { id: 'g-3', title: 'Mercado', amount: 100000, paid: true, is_linked_servicios: false },
    { id: 'g-4', title: 'Cartera', amount: 950000, paid: true, is_linked_servicios: false },
    { id: 'g-5', title: 'Apto', amount: 1200000, paid: true, is_linked_servicios: false },
    { id: 'g-6', title: 'TDC', amount: 500000, paid: true, is_linked_servicios: false },
    { id: 'g-7', title: 'LOVE', amount: 150000, paid: true, is_linked_servicios: false },
  ],
  servicios: [
    { id: 's-1', title: 'Agua', amount: 156000, paid: true },
    { id: 's-2', title: 'Luz', amount: 62000, paid: true },
    { id: 's-3', title: 'Internet', amount: 75000, paid: false },
    { id: 's-4', title: 'Gas', amount: 0, paid: false },
    { id: 's-5', title: 'Datos', amount: 40000, paid: false },
    { id: 's-6', title: 'Administración', amount: 270000, paid: true },
  ]
};

const DEFAULT_SETTINGS = {
  id: 'global',
  trm_cop_usd: 4000, // 1 USD = 4000 COP
  theme: 'dark',
  currency_primary: 'COP'
};

export const dbService = {
  // Configuración global
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      console.error('Error cargando configuración:', e);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error guardando configuración:', e);
    }
  },

  // Colección de Meses
  getAllMonths() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_MONTHS);
      if (!data) {
        // Inicializar con la semilla inicial
        const initialDict = { [INITIAL_SEED_MONTH.id]: INITIAL_SEED_MONTH };
        localStorage.setItem(STORAGE_KEY_MONTHS, JSON.stringify(initialDict));
        return initialDict;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error cargando meses:', e);
      return { [INITIAL_SEED_MONTH.id]: INITIAL_SEED_MONTH };
    }
  },

  getMonth(monthId) {
    const months = this.getAllMonths();
    return months[monthId] || null;
  },

  saveMonth(monthData) {
    const months = this.getAllMonths();
    
    // Auto-sincronizar "Mi casita" si existe en gastos
    const serviciosTotal = (monthData.servicios || []).reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
    const allServiciosPaid = (monthData.servicios || []).length > 0 && 
                             monthData.servicios.every(s => s.paid);

    const updatedGastos = (monthData.gastos || []).map(g => {
      if (g.is_linked_servicios || g.title.trim().toLowerCase() === 'mi casita') {
        return {
          ...g,
          title: 'Mi casita',
          amount: serviciosTotal,
          paid: allServiciosPaid,
          is_linked_servicios: true
        };
      }
      return g;
    });

    const updatedMonth = {
      ...monthData,
      gastos: updatedGastos
    };

    months[updatedMonth.id] = updatedMonth;
    try {
      localStorage.setItem(STORAGE_KEY_MONTHS, JSON.stringify(months));
    } catch (e) {
      console.error('Error guardando mes:', e);
    }
    return updatedMonth;
  },

  deleteMonth(monthId) {
    const months = this.getAllMonths();
    delete months[monthId];
    localStorage.setItem(STORAGE_KEY_MONTHS, JSON.stringify(months));
  },

  /**
   * Crea un nuevo mes basado en un mes fuente (duplicando gastos y servicios desmarcados)
   */
  createMonthFromTemplate(newMonthId, newMonthLabel, sourceMonthId = '2026-09') {
    const months = this.getAllMonths();
    const source = months[sourceMonthId] || months[Object.keys(months)[0]] || INITIAL_SEED_MONTH;

    const duplicatedGastos = (source.gastos || []).map((g, idx) => ({
      ...g,
      id: `g-${Date.now()}-${idx}`,
      paid: false // Desmarcado para el nuevo mes
    }));

    const duplicatedServicios = (source.servicios || []).map((s, idx) => ({
      ...s,
      id: `s-${Date.now()}-${idx}`,
      paid: false // Desmarcado para el nuevo mes
    }));

    const newMonth = {
      id: newMonthId,
      label: newMonthLabel,
      sueldo: source.sueldo || 5000000,
      extra: 0,
      ahorro_meta: source.ahorro_meta || 500000,
      ahorro_paid: false,
      cuentas: {
        nomina: 0,
        nequi: 0,
        efectivo: 0,
        otros: 0
      },
      gastos: duplicatedGastos,
      servicios: duplicatedServicios
    };

    return this.saveMonth(newMonth);
  },

  // Exportar / Importar base de datos NoSQL completa en formato JSON
  exportDatabaseJSON() {
    const dbExport = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      months: this.getAllMonths()
    };
    return JSON.stringify(dbExport, null, 2);
  },

  importDatabaseJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.months && typeof parsed.months === 'object') {
        localStorage.setItem(STORAGE_KEY_MONTHS, JSON.stringify(parsed.months));
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(parsed.settings));
      }
      return { success: true };
    } catch (e) {
      console.error('Error importando base de datos JSON:', e);
      return { success: false, error: e.message };
    }
  },

  resetToDefaultSeed() {
    localStorage.removeItem(STORAGE_KEY_MONTHS);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    return this.getAllMonths();
  }
};
