import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Check, ArrowDownToLine, Clock, BarChart3, Plus } from 'lucide-react';
import { formatMillisecondsToSexagesimal } from '../utils/timeConversion';
import { Operation } from '../types/industrial';

interface LapItem {
  lapNumber: number;
  elapsedMs: number;
  lapDurationMs: number;
  sexagesimal: string;
  centesimalMinutes: number;
}

interface StopwatchTimerProps {
  operations: Operation[];
  selectedOperationId: string | null;
  onSelectOperation: (id: string) => void;
  onApplyTime: (operationId: string, centesimalMinutes: number, sexagesimal: string) => void;
}

export const StopwatchTimer: React.FC<StopwatchTimerProps> = ({
  operations,
  selectedOperationId,
  onSelectOperation,
  onApplyTime,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [laps, setLaps] = useState<LapItem[]>([]);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedMsRef = useRef<number>(0);
  const lastLapTotalMsRef = useRef<number>(0);

  const updateTimer = () => {
    if (startTimeRef.current > 0) {
      const now = performance.now();
      const currentElapsed = accumulatedMsRef.current + (now - startTimeRef.current);
      setElapsedMs(currentElapsed);
      requestRef.current = requestAnimationFrame(updateTimer);
    }
  };

  const handleStart = () => {
    if (!isRunning) {
      startTimeRef.current = performance.now();
      setIsRunning(true);
      requestRef.current = requestAnimationFrame(updateTimer);
    }
  };

  const handlePause = () => {
    if (isRunning) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      accumulatedMsRef.current += performance.now() - startTimeRef.current;
      startTimeRef.current = 0;
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setIsRunning(false);
    setElapsedMs(0);
    setLaps([]);
    startTimeRef.current = 0;
    accumulatedMsRef.current = 0;
    lastLapTotalMsRef.current = 0;
  };

  const handleLap = () => {
    const currentTotal = elapsedMs;
    const lapDuration = currentTotal - lastLapTotalMsRef.current;
    lastLapTotalMsRef.current = currentTotal;

    const centesimal = Math.round((lapDuration / 60000) * 1000) / 1000;
    const newLap: LapItem = {
      lapNumber: laps.length + 1,
      elapsedMs: currentTotal,
      lapDurationMs: lapDuration,
      sexagesimal: formatMillisecondsToSexagesimal(lapDuration),
      centesimalMinutes: centesimal,
    };
    setLaps((prev) => [newLap, ...prev]);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const totalSec = elapsedMs / 1000;
  const currentCentesimalMinutes = Math.round((totalSec / 60) * 1000) / 1000;
  const currentSexagesimal = formatMillisecondsToSexagesimal(elapsedMs);

  // Estatísticas das tomadas de tempo (laps)
  const lapCount = laps.length;
  const averageLapCentesimal =
    lapCount > 0
      ? Math.round((laps.reduce((acc, l) => acc + l.centesimalMinutes, 0) / lapCount) * 1000) / 1000
      : currentCentesimalMinutes;

  const handleApplyTimeToOperation = (timeToSend: number, sexTime: string) => {
    if (!selectedOperationId) return;
    onApplyTime(selectedOperationId, timeToSend, sexTime);
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 2200);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Cronômetro Digital de Tomada de Tempos</h3>
            <p className="text-xs text-slate-500">Média de ciclos cronometrados com registro de voltas</p>
          </div>
        </div>

        {/* Seletor de Operação Destino */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">Operação Alvo:</span>
          <select
            value={selectedOperationId || ''}
            onChange={(e) => onSelectOperation(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 outline-none max-w-[200px] truncate"
          >
            <option value="">-- Selecione a Operação --</option>
            {operations.map((op) => (
              <option key={op.id} value={op.id}>
                {op.code}: {op.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Mostrador Principal */}
        <div className="lg:col-span-7 bg-slate-950 text-white rounded-xl p-6 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
          <div className="absolute top-3 left-4 text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            {isRunning ? 'Cronometrando' : elapsedMs > 0 ? 'Pausado' : 'Pronto'}
          </div>

          <div className="my-3 text-center">
            <div className="text-5xl sm:text-6xl font-mono font-extrabold tracking-tight text-amber-400 drop-shadow">
              {currentSexagesimal.slice(0, 5)}
              <span className="text-3xl sm:text-4xl text-amber-200/80">{currentSexagesimal.slice(5)}</span>
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">FORMATO SEXAGESIMAL (MM:SS.cc)</div>
          </div>

          <div className="w-full bg-slate-900/90 rounded-lg p-3 border border-slate-800 flex items-center justify-around text-center mt-2">
            <div>
              <div className="text-xs text-slate-400 font-medium">Minutos Centesimais</div>
              <div className="text-xl font-mono font-bold text-emerald-400">
                {currentCentesimalMinutes.toFixed(2)} <span className="text-xs font-normal">min</span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <div className="text-xs text-slate-400 font-medium">Centésimos (CM)</div>
              <div className="text-xl font-mono font-bold text-sky-400">
                {(currentCentesimalMinutes * 100).toFixed(0)} <span className="text-xs font-normal">CM</span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <div className="text-xs text-slate-400 font-medium">Ciclos / Voltas</div>
              <div className="text-xl font-mono font-bold text-purple-400">{laps.length}</div>
            </div>
          </div>

          {/* Botões de Ação do Cronômetro */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5 w-full">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow transition-all active:scale-95 text-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                Iniciar
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg shadow transition-all active:scale-95 text-sm"
              >
                <Pause className="w-4 h-4 fill-white" />
                Pausar
              </button>
            )}

            <button
              onClick={handleLap}
              disabled={elapsedMs === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-semibold rounded-lg border border-slate-700 transition-all text-sm"
            >
              <Flag className="w-4 h-4 text-sky-400" />
              Volta (Lap)
            </button>

            <button
              onClick={handleReset}
              disabled={elapsedMs === 0}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 font-medium rounded-lg border border-slate-700 transition-all text-sm"
              title="Zerar Cronômetro"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
            </button>

            {/* Aplicar tempo cronometrado à operação */}
            <button
              onClick={() =>
                handleApplyTimeToOperation(
                  laps.length > 0 ? averageLapCentesimal : currentCentesimalMinutes,
                  currentSexagesimal.slice(0, 5)
                )
              }
              disabled={elapsedMs === 0 || !selectedOperationId}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg shadow transition-all active:scale-95 text-sm ml-auto"
            >
              {appliedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-900" />
                  Tempo Gravado!
                </>
              ) : (
                <>
                  <ArrowDownToLine className="w-4 h-4" />
                  Salvar na Operação
                </>
              )}
            </button>
          </div>
        </div>

        {/* Histórico de Voltas / Ciclos da Medição */}
        <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 h-[280px] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
              <BarChart3 className="w-4 h-4 text-slate-600" />
              Voltas Cronometradas ({laps.length})
            </div>
            {laps.length > 0 && (
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Média: {averageLapCentesimal.toFixed(2)} min
              </span>
            )}
          </div>

          {laps.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
              <Clock className="w-8 h-8 text-slate-300 mb-2" />
              Clique em "Volta (Lap)" a cada ciclo da operação para calcular a média estatística de tempos.
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {laps.map((lap) => (
                <div
                  key={lap.lapNumber}
                  className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                      #{lap.lapNumber}
                    </span>
                    <span className="font-semibold text-slate-800">{lap.sexagesimal}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-700">{lap.centesimalMinutes.toFixed(2)} min</span>
                    <span className="text-[10px] text-slate-500 ml-1">({(lap.centesimalMinutes * 100).toFixed(0)} CM)</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {laps.length > 0 && selectedOperationId && (
            <button
              onClick={() => handleApplyTimeToOperation(averageLapCentesimal, formatMillisecondsToSexagesimal(averageLapCentesimal * 60000).slice(0, 5))}
              className="mt-3 w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Aplicar Média das {laps.length} Voltas ({averageLapCentesimal.toFixed(2)} min)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
