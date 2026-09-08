import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Printer,
  Trash2,
  Clock,
  Gauge,
  Sliders,
  Cpu,
  User,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Operation, OperationType, WestinghouseRating } from '../types/industrial';
import { sexagesimalToCentesimal, centesimalToSexagesimal } from '../utils/timeConversion';
import { calculateOperationMetrics } from '../utils/calculations';
import { WestinghouseModal } from './WestinghouseModal';
import { DEFAULT_WESTINGHOUSE_RATING } from '../utils/westinghouse';

interface OperationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  operation: Operation | null;
  onSave: (operation: Operation) => void;
  onDelete?: (operationId: string) => void;
  onPrintSimplified: (operation: Operation) => void;
  dailyDemand: number;
  workShiftHours: number;
}

export const OperationDetailModal: React.FC<OperationDetailModalProps> = ({
  isOpen,
  onClose,
  operation,
  onSave,
  onDelete,
  onPrintSimplified,
  dailyDemand,
  workShiftHours,
}) => {
  const [code, setCode] = useState('OP-010');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<OperationType>('manual');
  const [machineName, setMachineName] = useState('');
  const [sexInput, setSexInput] = useState('01:30');
  const [centesimalTime, setCentesimalTime] = useState(1.50);
  const [workPace, setWorkPace] = useState(100);
  const [fatigueTolerance, setFatigueTolerance] = useState(12);
  const [westinghouseRating, setWestinghouseRating] = useState<WestinghouseRating>(
    DEFAULT_WESTINGHOUSE_RATING
  );
  const [isWestinghouseOpen, setIsWestinghouseOpen] = useState(false);

  useEffect(() => {
    if (operation) {
      setCode(operation.code);
      setName(operation.name);
      setDescription(operation.description);
      setType(operation.type);
      setMachineName(operation.machineName || '');
      setSexInput(operation.measuredTimeSexagesimal || '01:30');
      setCentesimalTime(operation.measuredTimeCentesimal || 1.50);
      setWorkPace(operation.workPace || 100);
      setFatigueTolerance(operation.fatigueTolerancePercent || 12);
      if (operation.westinghouseRating) {
        setWestinghouseRating(operation.westinghouseRating);
      }
    } else {
      // Nova operação
      setCode('OP-' + String(Math.floor(Math.random() * 900) + 100));
      setName('');
      setDescription('');
      setType('manual');
      setMachineName('');
      setSexInput('01:15');
      setCentesimalTime(1.25);
      setWorkPace(100);
      setFatigueTolerance(12);
      setWestinghouseRating(DEFAULT_WESTINGHOUSE_RATING);
    }
  }, [operation, isOpen]);

  if (!isOpen) return null;

  // Lidar com alteração do tempo sexagesimal
  const handleSexInputChange = (val: string) => {
    setSexInput(val);
    const res = sexagesimalToCentesimal(val);
    if (res.valid) {
      setCentesimalTime(res.centesimalMinutes);
    }
  };

  // Lidar com alteração direta do centesimal
  const handleCentesimalChange = (val: number) => {
    setCentesimalTime(val);
    const res = centesimalToSexagesimal(val);
    if (res.valid) {
      setSexInput(res.sexagesimalFormatted);
    }
  };

  // Cálculos em tempo real
  const metrics = calculateOperationMetrics(
    centesimalTime,
    workPace,
    fatigueTolerance,
    dailyDemand,
    workShiftHours
  );

  const handleSave = () => {
    if (!name.trim()) return;

    const updatedOp: Operation = {
      id: operation?.id || `op-${Date.now()}`,
      modelId: operation?.modelId || '',
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      type,
      machineName: type !== 'manual' ? machineName.trim() : undefined,
      measuredTimeSexagesimal: sexInput.trim(),
      measuredTimeCentesimal: centesimalTime,
      workPace,
      fatigueTolerancePercent: fatigueTolerance,
      westinghouseRating,
      fatigueCategory: metrics.fatigueCategory,
      normalTime: metrics.normalTime,
      standardTime: metrics.standardTime,
      piecesPerHour: metrics.piecesPerHour,
      piecesPerDay: metrics.piecesPerDay,
      requiredWorkstations: metrics.requiredWorkstations,
      measurements: operation?.measurements || [],
      createdAt: operation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedOp);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-sm">
                {code || 'OP'}
              </div>
              <div>
                <h2 className="text-base font-bold">
                  {operation ? 'Gerenciamento da Operação & Cronoanálise' : 'Nova Operação Industrial'}
                </h2>
                <p className="text-xs text-slate-400">
                  Cálculo de tempos, fator de ritmo, tolerância Westinghouse e postos de trabalho
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {operation && (
                <button
                  type="button"
                  onClick={() => {
                    const tempOp: Operation = {
                      ...operation,
                      code,
                      name,
                      description,
                      type,
                      machineName,
                      measuredTimeSexagesimal: sexInput,
                      measuredTimeCentesimal: centesimalTime,
                      workPace,
                      fatigueTolerancePercent: fatigueTolerance,
                      westinghouseRating,
                      ...metrics,
                    };
                    onPrintSimplified(tempOp);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold transition-colors"
                  title="Imprimir Relatório Simplificado da Operação com Cálculos"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Imprimir Relatório</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
            {/* Dados Cadastrais Básicos */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Código da Op
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="OP-010"
                  className="w-full text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="md:col-span-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Nome da Operação *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Soldagem TIG dos Flanges / Usinagem CNC"
                  className="w-full text-sm font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Tipo de Operação
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as OperationType)}
                  className="w-full text-sm font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="manual">Manual (Operador)</option>
                  <option value="machine">Máquina (Automatizada)</option>
                  <option value="mixed">Misto (Manual + Máquina)</option>
                </select>
              </div>

              {type !== 'manual' && (
                <div className="md:col-span-12">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Equipamento / Máquina / Dispositivo
                  </label>
                  <input
                    type="text"
                    value={machineName}
                    onChange={(e) => setMachineName(e.target.value)}
                    placeholder="Ex: Torno CNC Haas ST-20 / Prensas Hidráulica 50T"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}

              <div className="md:col-span-12">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Descrição do Método de Trabalho
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva a sequência de movimentos, ferramentas utilizadas e pontos de controle de qualidade..."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Painel de Tempos & Conversão */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                <Clock className="w-4 h-4 text-amber-600" />
                Cronometragem e Conversão de Tempo
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sexagesimal */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Tempo Cronometrado Sexagesimal (MM:SS)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={sexInput}
                      onChange={(e) => handleSexInputChange(e.target.value)}
                      placeholder="01:30"
                      className="w-full font-mono text-xl font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-amber-500 outline-none text-slate-900"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Ex: 01:30 para 1 min e 30 seg</p>
                </div>

                {/* Centesimal */}
                <div className="bg-amber-50/70 p-3.5 rounded-lg border border-amber-200">
                  <label className="block text-xs font-semibold text-amber-900 mb-1">
                    Tempo Centesimal Convertido (DM / min)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={centesimalTime}
                      onChange={(e) => handleCentesimalChange(parseFloat(e.target.value) || 0)}
                      className="w-full font-mono text-xl font-bold bg-white border border-amber-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-amber-500 outline-none text-slate-900"
                    />
                    <span className="text-xs font-semibold text-amber-900 font-mono">min</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1 font-mono">
                    = {(centesimalTime * 100).toFixed(0)} centiminutos (CM)
                  </p>
                </div>
              </div>
            </div>

            {/* Sliders de Ritmo e Tolerâncias Westinghouse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ritmo de Trabalho */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                    <Gauge className="w-4 h-4 text-emerald-600" />
                    Ritmo de Trabalho (Desempenho)
                  </div>
                  <span className="text-sm font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {workPace}%
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  step="5"
                  value={workPace}
                  onChange={(e) => setWorkPace(parseInt(e.target.value) || 100)}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer my-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>80% (Lento)</span>
                  <span className="font-semibold text-slate-700">100% (Padrão Normal)</span>
                  <span>120%+ (Acelerado)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Fator de nivelamento da velocidade do operador em relação ao ritmo padrão industrial.
                </p>
              </div>

              {/* Tolerâncias de Fadiga / Westinghouse */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                      <Sliders className="w-4 h-4 text-amber-600" />
                      Tolerância de Fadiga & Westinghouse
                    </div>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        metrics.fatigueCategory === 'leve'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : metrics.fatigueCategory === 'moderada'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {fatigueTolerance}% ({metrics.fatigueCategory})
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={fatigueTolerance}
                    onChange={(e) => setFatigueTolerance(parseInt(e.target.value) || 12)}
                    className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer my-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Leve (5-11%)</span>
                    <span>Moderada (12-18%)</span>
                    <span>Pesada (19%+)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsWestinghouseOpen(true)}
                  className="mt-3 w-full py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Abrir Tabela Westinghouse Completa
                </button>
              </div>
            </div>

            {/* Painel de Resultados dos Cálculos de Engenharia */}
            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-inner">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center justify-between">
                <span>Resultados dos Cálculos de Produção (Engenharia de Métodos)</span>
                <span className="text-[11px] text-slate-400 normal-case font-normal">
                  Demanda: <b>{dailyDemand} pçs/dia</b> | Turno: <b>{workShiftHours}h (528 min)</b>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                  <div className="text-[11px] text-slate-400 font-medium">Tempo Normal (TN)</div>
                  <div className="text-lg font-mono font-bold text-white mt-0.5">
                    {metrics.normalTime.toFixed(2)}{' '}
                    <span className="text-xs font-normal text-slate-400">min</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">TC × ({workPace}%)</div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                  <div className="text-[11px] text-amber-300 font-medium">Tempo Padrão (TP)</div>
                  <div className="text-lg font-mono font-bold text-amber-400 mt-0.5">
                    {metrics.standardTime.toFixed(2)}{' '}
                    <span className="text-xs font-normal text-amber-200">min</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    TN × (1 + {fatigueTolerance}%)
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                  <div className="text-[11px] text-slate-400 font-medium">Produção / Hora</div>
                  <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                    {metrics.piecesPerHour.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-slate-400">pçs/h</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">60 ÷ TP</div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
                  <div className="text-[11px] text-slate-400 font-medium">Produção / Dia (8.8h)</div>
                  <div className="text-lg font-mono font-bold text-sky-400 mt-0.5">
                    {metrics.piecesPerDay.toFixed(0)}{' '}
                    <span className="text-xs font-normal text-slate-400">pçs</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">528 min ÷ TP</div>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    metrics.requiredWorkstations > 2
                      ? 'bg-rose-950/60 border-rose-600/60'
                      : 'bg-slate-800/80 border-slate-700/60'
                  }`}
                >
                  <div className="text-[11px] font-medium text-purple-300 flex items-center justify-between">
                    <span>Postos Necessários</span>
                    {metrics.requiredWorkstations > 2 && (
                      <span className="text-[10px] bg-rose-500 text-white font-bold px-1 rounded">
                        Gargalo
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-mono font-extrabold text-purple-400 mt-0.5">
                    {metrics.requiredWorkstations.toFixed(2)}{' '}
                    <span className="text-xs font-normal text-slate-400">
                      ({Math.ceil(metrics.requiredWorkstations)} op.)
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    Demanda ÷ Prod. Dia
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div>
              {operation && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Tem certeza que deseja excluir a operação ${code} - ${name}?`)) {
                      onDelete(operation.id);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir Operação
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                Salvar Operação
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal da Tabela Westinghouse */}
      <WestinghouseModal
        isOpen={isWestinghouseOpen}
        onClose={() => setIsWestinghouseOpen(false)}
        currentRating={westinghouseRating}
        operationName={`${code} - ${name || 'Nova Operação'}`}
        onSave={(newRating, totalTol, cat) => {
          setWestinghouseRating(newRating);
          setFatigueTolerance(totalTol);
        }}
      />
    </>
  );
};
