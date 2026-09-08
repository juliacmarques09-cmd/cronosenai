import React from 'react';
import {
  Timer,
  ArrowRightLeft,
  HardDrive,
  Printer,
  FileCode2,
  Plus,
  Box,
  ChevronDown,
  Settings2,
} from 'lucide-react';
import { ProductModel } from '../types/industrial';

interface HeaderProps {
  models: ProductModel[];
  activeModel: ProductModel;
  onSelectModel: (modelId: string) => void;
  onNewModel: () => void;
  onEditModel: () => void;
  onOpenConverter: () => void;
  onOpenGoogleDrive: () => void;
  onOpenPrintReport: () => void;
  onOpenPromptViewer: () => void;
  onScrollToStopwatch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  models,
  activeModel,
  onSelectModel,
  onNewModel,
  onEditModel,
  onOpenConverter,
  onOpenGoogleDrive,
  onOpenPrintReport,
  onOpenPromptViewer,
  onScrollToStopwatch,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Marca */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-sm font-black text-xl">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                CronoInd
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Industrial v2.0
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Cronometragem, Tabela Westinghouse & Balanceamento de Produção
            </p>
          </div>
        </div>

        {/* Seletor de Modelo Ativo */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-xl px-2.5 py-1.5">
          <Box className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">
              Modelo em Análise
            </span>
            <select
              value={activeModel.id}
              onChange={(e) => onSelectModel(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer pr-2 truncate max-w-[180px] sm:max-w-[220px]"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                  {m.code} - {m.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onEditModel}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors ml-1"
            title="Editar Parâmetros do Modelo (Demanda/Turno)"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onNewModel}
            className="p-1 hover:bg-slate-700 rounded text-amber-400 hover:text-amber-300 transition-colors"
            title="Novo Modelo"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Botões de Ação na Toolbar Superior */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Conversor Rápido */}
          <button
            onClick={onOpenConverter}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            title="Conversor MM:SS ↔ Centesimal"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Conversor</span>
          </button>

          {/* Cronômetro */}
          <button
            onClick={onScrollToStopwatch}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            title="Rolar até o Cronômetro Digital"
          >
            <Timer className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Cronômetro</span>
          </button>

          {/* Armazenamento Google Drive */}
          <button
            onClick={onOpenGoogleDrive}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            title="Sincronização e Backup Google Drive"
          >
            <HardDrive className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden lg:inline">Google Drive</span>
          </button>

          {/* Imprimir Relatório Geral */}
          <button
            onClick={onOpenPrintReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-all"
            title="Gerar e Imprimir Relatório da Linha em PDF/HTML"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Relatório</span>
          </button>

          {/* Ver Prompt / Blueprint */}
          <button
            onClick={onOpenPromptViewer}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-lg border border-slate-700 transition-colors"
            title="Ver Prompt e Blueprint Técnico do App"
          >
            <FileCode2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
