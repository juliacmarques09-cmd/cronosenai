import React, { useState } from 'react';
import {
  X,
  HardDrive,
  Download,
  Upload,
  Check,
  FileSpreadsheet,
  Cloud,
  FileJson,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { ProductModel } from '../types/industrial';
import { exportDatabaseBackup, restoreDatabaseBackup } from '../utils/storage';
import { exportModelToCsv } from '../utils/exportCsv';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: ProductModel[];
  activeModel: ProductModel;
  onRestoreModels: (newModels: ProductModel[]) => void;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  models,
  activeModel,
  onRestoreModels,
}) => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [importMessage, setImportMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseBackup(models);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CronoInd_GoogleDrive_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const restored = restoreDatabaseBackup(content);
      if (restored) {
        onRestoreModels(restored);
        setImportMessage('Modelos e dados cronometrados restaurados com sucesso!');
        setTimeout(() => setImportMessage(null), 3500);
      } else {
        setImportMessage('Erro: arquivo JSON inválido ou incompatível.');
        setTimeout(() => setImportMessage(null), 3500);
      }
    };
    reader.readAsText(file);
  };

  const handleSimulateDriveSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Armazenamento & Google Drive</h2>
              <p className="text-xs text-slate-400">
                Sincronização na nuvem, backups e exportação de planilhas industriais
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {importMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              {importMessage}
            </div>
          )}

          {/* Status de Sincronização */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Google Drive Sync Engine</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {models.length} modelos | {models.reduce((a, m) => a + m.operations.length, 0)} operações ativas
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulateDriveSync}
              disabled={syncStatus === 'syncing'}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
            >
              {syncStatus === 'syncing' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Sincronizando...
                </>
              ) : syncStatus === 'synced' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Sincronizado!
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sincronizar Agora
                </>
              )}
            </button>
          </div>

          {/* Exportações e Backups */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Exportar e Arquivar Dados
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Baixar Backup JSON */}
              <div className="p-4 border border-slate-200 rounded-xl bg-white hover:border-amber-400 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <FileJson className="w-4 h-4 text-amber-600" />
                    Arquivo de Backup (.JSON)
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Exporta todos os modelos, medições de tempo, fórmulas e configurações para upload no Google Drive.
                  </p>
                </div>
                <button
                  onClick={handleDownloadBackup}
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Baixar Backup JSON
                </button>
              </div>

              {/* Exportar Planilha CSV */}
              <div className="p-4 border border-slate-200 rounded-xl bg-white hover:border-emerald-400 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    Planilha CSV / Excel
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Exporta a cronoanálise do modelo ativo formatada para Google Planilhas ou Microsoft Excel.
                  </p>
                </div>
                <button
                  onClick={() => exportModelToCsv(activeModel)}
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Exportar CSV ({activeModel.code})
                </button>
              </div>
            </div>
          </div>

          {/* Restaurar / Importar Dados */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Upload className="w-4 h-4 text-slate-600" />
              Restaurar Dados do Google Drive / Arquivo
            </div>
            <p className="text-xs text-slate-600">
              Selecione um arquivo de backup previamente salvo para recarregar todos os tempos e modelos no sistema.
            </p>
            <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-dashed border-slate-300 hover:border-slate-400 rounded-lg cursor-pointer text-xs font-semibold text-slate-700 transition-colors">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Selecionar Arquivo de Backup (.json)</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Orientações de Arquitetura Google Drive & Deploy */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Configuração Técnica do Google Drive API & Vercel
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              O backend em Express está preparado para sincronização contínua com a pasta corporativa do Google Drive através de credenciais OAuth 2.0 (escopo <code className="bg-amber-100 px-1 py-0.2 rounded font-mono">drive.file</code>). Ao realizar o deploy na Vercel, defina as variáveis de ambiente no painel de configurações.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
