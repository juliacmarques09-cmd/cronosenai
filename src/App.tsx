import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Printer,
  FileSpreadsheet,
  HardDrive,
  Clock,
  Sparkles,
  ArrowRightLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sliders,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { ProductModel, Operation } from './types/industrial';
import {
  getStoredModels,
  saveStoredModels,
  getStoredActiveModelId,
  saveStoredActiveModelId,
  INITIAL_MODELS,
} from './utils/storage';
import { calculateOperationMetrics } from './utils/calculations';
import { exportModelToCsv } from './utils/exportCsv';
import { Header } from './components/Header';
import { DashboardKPIs } from './components/DashboardKPIs';
import { QuickConverter } from './components/QuickConverter';
import { StopwatchTimer } from './components/StopwatchTimer';
import { OperationsTable } from './components/OperationsTable';
import { OptimizationEngine } from './components/OptimizationEngine';
import { OperationDetailModal } from './components/OperationDetailModal';
import { ModelModal } from './components/ModelModal';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { PrintReport } from './components/PrintReport';
import { PromptViewerModal } from './components/PromptViewerModal';

export default function App() {
  const [models, setModels] = useState<ProductModel[]>(() => getStoredModels());
  const [activeModelId, setActiveModelId] = useState<string>(() =>
    getStoredActiveModelId(models)
  );

  // Modais de Controle
  const [isOperationModalOpen, setIsOperationModalOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState<Operation | null>(null);

  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<ProductModel | null>(null);

  const [isGoogleDriveOpen, setIsGoogleDriveOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isConverterExpanded, setIsConverterExpanded] = useState(false);

  // Relatório de Impressão
  const [isPrintViewActive, setIsPrintViewActive] = useState(false);
  const [printSingleOperation, setPrintSingleOperation] = useState<Operation | null>(null);

  // Cronômetro - Operação Selecionada
  const [stopwatchOperationId, setStopwatchOperationId] = useState<string | null>(null);

  const stopwatchRef = useRef<HTMLDivElement | null>(null);

  // Salvar modelos sempre que houver alteração
  useEffect(() => {
    saveStoredModels(models);
  }, [models]);

  useEffect(() => {
    saveStoredActiveModelId(activeModelId);
  }, [activeModelId]);

  // Obter modelo ativo
  const activeModel =
    models.find((m) => m.id === activeModelId) || models[0] || INITIAL_MODELS[0];

  // Definir operação inicial para o cronômetro se ainda não tiver
  useEffect(() => {
    if (activeModel && activeModel.operations.length > 0 && !stopwatchOperationId) {
      setStopwatchOperationId(activeModel.operations[0].id);
    }
  }, [activeModel, stopwatchOperationId]);

  // Recalcular métricas de todas as operações ao alterar demanda diária
  const handleUpdateDemand = (newDemand: number) => {
    const updatedOperations = activeModel.operations.map((op) => ({
      ...op,
      ...calculateOperationMetrics(
        op.measuredTimeCentesimal,
        op.workPace,
        op.fatigueTolerancePercent,
        newDemand,
        activeModel.workShiftHours
      ),
    }));

    const updatedModel = {
      ...activeModel,
      dailyDemand: newDemand,
      operations: updatedOperations,
      updatedAt: new Date().toISOString(),
    };

    setModels((prev) => prev.map((m) => (m.id === updatedModel.id ? updatedModel : m)));
  };

  // Salvar/Adicionar Operação
  const handleSaveOperation = (savedOp: Operation) => {
    const existingIndex = activeModel.operations.findIndex((o) => o.id === savedOp.id);
    let updatedOps: Operation[];

    if (existingIndex >= 0) {
      updatedOps = [...activeModel.operations];
      updatedOps[existingIndex] = savedOp;
    } else {
      updatedOps = [...activeModel.operations, savedOp];
    }

    const updatedModel: ProductModel = {
      ...activeModel,
      operations: updatedOps,
      updatedAt: new Date().toISOString(),
    };

    setModels((prev) => prev.map((m) => (m.id === updatedModel.id ? updatedModel : m)));
  };

  // Excluir Operação
  const handleDeleteOperation = (opId: string) => {
    const updatedOps = activeModel.operations.filter((o) => o.id !== opId);
    const updatedModel: ProductModel = {
      ...activeModel,
      operations: updatedOps,
      updatedAt: new Date().toISOString(),
    };
    setModels((prev) => prev.map((m) => (m.id === updatedModel.id ? updatedModel : m)));
  };

  // Salvar/Editar Modelo
  const handleSaveModel = (modelData: Partial<ProductModel>) => {
    if (editingModel) {
      // Editar existente
      const updatedModel: ProductModel = {
        ...editingModel,
        ...modelData,
        updatedAt: new Date().toISOString(),
      };
      // Recalcular postos de trabalho com nova demanda/jornada
      updatedModel.operations = updatedModel.operations.map((op) => ({
        ...op,
        ...calculateOperationMetrics(
          op.measuredTimeCentesimal,
          op.workPace,
          op.fatigueTolerancePercent,
          updatedModel.dailyDemand,
          updatedModel.workShiftHours
        ),
      }));

      setModels((prev) => prev.map((m) => (m.id === updatedModel.id ? updatedModel : m)));
    } else {
      // Criar novo modelo
      const newModel: ProductModel = {
        id: `model-${Date.now()}`,
        code: modelData.code || 'MOD-NEW',
        name: modelData.name || 'Novo Modelo',
        description: modelData.description || '',
        dailyDemand: modelData.dailyDemand || 400,
        workShiftHours: modelData.workShiftHours || 8.8,
        operations: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setModels((prev) => [...prev, newModel]);
      setActiveModelId(newModel.id);
    }
    setEditingModel(null);
  };

  // Excluir Modelo
  const handleDeleteModel = (modelId: string) => {
    if (models.length <= 1) {
      alert('É necessário manter pelo menos um modelo cadastrado.');
      return;
    }
    const remaining = models.filter((m) => m.id !== modelId);
    setModels(remaining);
    setActiveModelId(remaining[0].id);
  };

  // Aplicar tempo medido do cronômetro diretamente para a operação
  const handleApplyStopwatchTime = (
    operationId: string,
    centesimalMinutes: number,
    sexagesimal: string
  ) => {
    const op = activeModel.operations.find((o) => o.id === operationId);
    if (!op) return;

    const metrics = calculateOperationMetrics(
      centesimalMinutes,
      op.workPace,
      op.fatigueTolerancePercent,
      activeModel.dailyDemand,
      activeModel.workShiftHours
    );

    const newMeasurement = {
      id: `m-${Date.now()}`,
      operationId,
      timestamp: new Date().toISOString(),
      sexagesimalInput: sexagesimal,
      minutes: Math.floor(centesimalMinutes),
      seconds: Math.round((centesimalMinutes % 1) * 60),
      totalSeconds: Math.round(centesimalMinutes * 60 * 10) / 10,
      centesimalMinutes,
      centesimalSeconds: Math.round(centesimalMinutes * 100),
      notes: 'Cronometrado via CronoInd Live Timer',
    };

    const updatedOp: Operation = {
      ...op,
      measuredTimeCentesimal: centesimalMinutes,
      measuredTimeSexagesimal: sexagesimal,
      ...metrics,
      measurements: [newMeasurement, ...(op.measurements || [])],
      updatedAt: new Date().toISOString(),
    };

    handleSaveOperation(updatedOp);
  };

  // Impressão
  const handleOpenPrintGeneral = () => {
    setPrintSingleOperation(null);
    setIsPrintViewActive(true);
  };

  const handleOpenPrintSingle = (op: Operation) => {
    setPrintSingleOperation(op);
    setIsPrintViewActive(true);
  };

  const scrollToStopwatch = () => {
    if (stopwatchRef.current) {
      stopwatchRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Se a tela de impressão estiver ativa
  if (isPrintViewActive) {
    return (
      <PrintReport
        model={activeModel}
        singleOperation={printSingleOperation}
        onBack={() => setIsPrintViewActive(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900 text-slate-900">
      {/* Header Principal com Ações Rápidas */}
      <Header
        models={models}
        activeModel={activeModel}
        onSelectModel={(id) => setActiveModelId(id)}
        onNewModel={() => {
          setEditingModel(null);
          setIsModelModalOpen(true);
        }}
        onEditModel={() => {
          setEditingModel(activeModel);
          setIsModelModalOpen(true);
        }}
        onOpenConverter={() => setIsConverterExpanded(!isConverterExpanded)}
        onOpenGoogleDrive={() => setIsGoogleDriveOpen(true)}
        onOpenPrintReport={handleOpenPrintGeneral}
        onOpenPromptViewer={() => setIsPromptModalOpen(true)}
        onScrollToStopwatch={scrollToStopwatch}
      />

      {/* Conteúdo Principal */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 flex-1">
        {/* Banner do Modelo Ativo & Configurações de Linha */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                {activeModel.code}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {activeModel.name}
              </h2>
            </div>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              {activeModel.description || 'Modelo de fabricação industrial sem descrição informada.'}
            </p>
          </div>

          {/* Controle Rápido de Demanda & Turno */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:px-4 shrink-0">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block leading-tight">
                Demanda Diária
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={activeModel.dailyDemand}
                  onChange={(e) => handleUpdateDemand(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 font-mono font-bold text-sm bg-white border border-slate-300 rounded px-2 py-0.5 text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-xs font-semibold text-slate-600">pçs</span>
              </div>
            </div>

            <div className="w-px h-8 bg-slate-200" />

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block leading-tight">
                Jornada Padrão
              </span>
              <div className="font-mono font-bold text-sm text-slate-800 mt-0.5">
                {activeModel.workShiftHours}h{' '}
                <span className="text-xs font-normal text-slate-500">
                  ({activeModel.workShiftHours * 60}m)
                </span>
              </div>
            </div>

            <div className="w-px h-8 bg-slate-200" />

            <button
              onClick={() => exportModelToCsv(activeModel)}
              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
              title="Exportar Planilha CSV para Google Drive / Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard de KPIs & Gráfico de Balanceamento */}
        <DashboardKPIs
          model={activeModel}
          onSelectOperation={(op) => {
            setEditingOperation(op);
            setIsOperationModalOpen(true);
          }}
        />

        {/* Conversor Sexagesimal ↔ Centesimal (Expansível ou Atalho) */}
        {isConverterExpanded && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-200">
            <QuickConverter />
          </div>
        )}

        {/* Cronômetro Digital de Precisão Industrial */}
        <div ref={stopwatchRef}>
          <StopwatchTimer
            operations={activeModel.operations}
            selectedOperationId={stopwatchOperationId}
            onSelectOperation={(id) => setStopwatchOperationId(id)}
            onApplyTime={handleApplyStopwatchTime}
          />
        </div>

        {/* Tabela Principal de Operações e Parâmetros de Cronoanálise */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Operações Cadastradas ({activeModel.operations.length})
              </h3>
              <p className="text-xs text-slate-500">
                Gerenciamento, ritmos, tolerâncias Westinghouse e cálculo de postos de trabalho
              </p>
            </div>
          </div>

          <OperationsTable
            model={activeModel}
            onEditOperation={(op) => {
              setEditingOperation(op);
              setIsOperationModalOpen(true);
            }}
            onNewOperation={() => {
              setEditingOperation(null);
              setIsOperationModalOpen(true);
            }}
            onDeleteOperation={handleDeleteOperation}
            onSelectForStopwatch={(id) => {
              setStopwatchOperationId(id);
              scrollToStopwatch();
            }}
            onPrintOperation={handleOpenPrintSingle}
          />
        </div>

        {/* Motor de Sugestões de Otimização & Gargalos */}
        <OptimizationEngine
          model={activeModel}
          onSelectOperationByCode={(code) => {
            const op = activeModel.operations.find((o) => o.code === code);
            if (op) {
              setEditingOperation(op);
              setIsOperationModalOpen(true);
            }
          }}
        />
      </main>

      {/* Rodapé Industrial */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 font-mono">
            <div className="w-5 h-5 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              C
            </div>
            <span className="font-bold text-slate-200">CronoInd Enterprise</span> • Engenharia de Métodos & Cronoanálise
          </div>

          <div className="text-[11px] text-slate-400">
            Normas de Referência: Westinghouse Rating System • Ergonomia OIT / NR-17 • Fator de Turno 8,8h (528 min)
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPromptModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold text-xs hover:underline"
            >
              Blueprint / Prompt do App
            </button>
            <span>•</span>
            <button
              onClick={() => setIsGoogleDriveOpen(true)}
              className="text-slate-300 hover:text-white font-medium"
            >
              Drive & Backups
            </button>
          </div>
        </div>
      </footer>

      {/* Modais do Sistema */}
      <OperationDetailModal
        isOpen={isOperationModalOpen}
        onClose={() => setIsOperationModalOpen(false)}
        operation={editingOperation}
        onSave={handleSaveOperation}
        onDelete={handleDeleteOperation}
        onPrintSimplified={handleOpenPrintSingle}
        dailyDemand={activeModel.dailyDemand}
        workShiftHours={activeModel.workShiftHours}
      />

      <ModelModal
        isOpen={isModelModalOpen}
        onClose={() => {
          setIsModelModalOpen(false);
          setEditingModel(null);
        }}
        model={editingModel}
        onSave={handleSaveModel}
        onDelete={handleDeleteModel}
      />

      <GoogleDriveSyncModal
        isOpen={isGoogleDriveOpen}
        onClose={() => setIsGoogleDriveOpen(false)}
        models={models}
        activeModel={activeModel}
        onRestoreModels={(restored) => {
          setModels(restored);
          setActiveModelId(restored[0]?.id || '');
        }}
      />

      <PromptViewerModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />
    </div>
  );
}
