import React, { useState } from 'react';
import { X, Download, Upload, Database, RefreshCw, Copy, Check, FileJson } from 'lucide-react';
import { dbService } from '../services/dbService';

export const DatabaseModal = ({ isOpen, onClose, onDataReload }) => {
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  if (!isOpen) return null;

  const rawJson = dbService.exportDatabaseJSON();

  const handleExportFile = () => {
    const blob = new Blob([rawJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mis_finanzas_nosql_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(rawJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = dbService.importDatabaseJSON(event.target.result);
      if (result.success) {
        setImportStatus({ type: 'success', msg: '¡Base de datos JSON restaurada exitosamente!' });
        onDataReload();
      } else {
        setImportStatus({ type: 'error', msg: `Error importando: ${result.error}` });
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('¿Estás seguro de restablecer los datos a los valores iniciales de la plantilla?')) {
      dbService.resetToDefaultSeed();
      setImportStatus({ type: 'success', msg: 'Base de datos restablecida a los valores iniciales.' });
      onDataReload();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '750px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.8rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '0.5rem', borderRadius: '10px' }}>
              <Database size={22} color="var(--accent-purple)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>Base de Datos NoSQL Local (JSON)</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Manejo directo de colecciones de documentos JSON</span>
            </div>
          </div>

          <button className="btn-secondary" style={{ padding: '0.4rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Status Alert */}
        {importStatus && (
          <div style={{
            padding: '0.6rem 1rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            background: importStatus.type === 'success' ? 'var(--success-bg)' : 'var(--warning-bg)',
            border: `1px solid ${importStatus.type === 'success' ? 'var(--success-border)' : 'var(--warning-border)'}`,
            color: importStatus.type === 'success' ? 'var(--success)' : 'var(--warning)'
          }}>
            {importStatus.msg}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          <button className="btn-primary" onClick={handleExportFile}>
            <Download size={16} /> Exportar BD (.JSON)
          </button>

          <label className="btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
            <Upload size={16} color="var(--accent-cyan)" /> Importar Backup JSON
            <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          <button className="btn-secondary" onClick={handleCopyClipboard}>
            {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
            <span>{copied ? '¡Copiado!' : 'Copiar JSON'}</span>
          </button>

          <button className="btn-secondary" onClick={handleResetData} style={{ marginLeft: 'auto', borderColor: 'var(--warning-border)', color: 'var(--warning)' }}>
            <RefreshCw size={16} /> Restablecer Semilla
          </button>
        </div>

        {/* JSON Viewer */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileJson size={14} color="var(--accent-amber)" /> Vista previa del Documento JSON almacenado:
          </div>
          <pre style={{
            flex: 1,
            background: 'var(--bg-input)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            overflow: 'auto',
            color: '#a5b4fc',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            lineHeight: 1.4
          }}>
            {rawJson}
          </pre>
        </div>

      </div>
    </div>
  );
};
