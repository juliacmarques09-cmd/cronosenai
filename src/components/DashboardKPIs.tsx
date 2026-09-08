import React from 'react';
import {
  Timer,
  AlertTriangle,
  Factory,
  Users,
  Percent,
  TrendingUp,
  Flame,
  ArrowUpRight,
} from 'lucide-react';
import { ProductModel, Operation } from '../types/industrial';
import { calculateLineBalanceKPIs } from '../utils/calculations';

interface DashboardKPIsProps {
  model: ProductModel;
  onSelectOperation?: (op: Operation) => void;
}

export const DashboardKPIs: React.FC<DashboardKPIsProps> = ({ model, onSelectOperation }) => {
  const kpis = calculateLineBalanceKPIs(model);
  const operations = model.operations || [];

  // Encontrar valor máximo para escala do gráfico
  const maxTime = Math.max(...operations.map((op) => op.standardTime), 0.1);
  const avgTime =
    operations.length > 0
      ? operations.reduce((acc, op) => acc + op.standardTime, 0) / operations.length
      : 0;

  return (
    <div className="space-y-4">
      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Tempo de Ciclo Total */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ciclo Total (Soma TP)</span>
            <Timer className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-mono font-bold text-slate-900">
            {kpis.totalCycleTimeMinutes.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-500">min</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            = {(kpis.totalCycleTimeMinutes * 60).toFixed(0)}s totais
          </div>
        </div>

        {/* Operação Gargalo */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
              Gargalo da Linha
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-lg font-mono font-bold text-rose-700 truncate">
            {kpis.bottleneckOperation ? kpis.bottleneckOperation.code : 'Nenhum'}
          </div>
          <div className="text-[11px] text-slate-600 truncate mt-0.5">
            {kpis.bottleneckOperation ? `${kpis.maxCycleTime.toFixed(2)} min (${kpis.bottleneckOperation.name})` : '-'}
          </div>
        </div>

        {/* Capacidade Máxima da Linha */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Capacidade Linha</span>
            <Factory className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-mono font-bold text-emerald-700">
            {kpis.lineCapacityPerHour.toFixed(0)}{' '}
            <span className="text-xs font-normal text-slate-500">pçs/h</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            {kpis.lineCapacityPerDay.toFixed(0)} pçs/dia (8.8h)
          </div>
        </div>

        {/* Postos de Trabalho Totais */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Postos Totais</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-mono font-bold text-purple-700">
            {kpis.totalWorkstations.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-500">
              ({Math.ceil(kpis.totalWorkstations)} op.)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Para {model.dailyDemand} pçs/dia</div>
        </div>

        {/* Eficiência de Balanceamento */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Balanceamento</span>
            <Percent className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl font-mono font-bold text-sky-700">
            {kpis.balanceEfficiencyPercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {kpis.balanceEfficiencyPercent >= 80 ? 'Bom Alinhamento' : 'Desbalanceada'}
          </div>
        </div>

        {/* Média de Ritmo e Fadiga */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ritmo / Fadiga</span>
            <Flame className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-lg font-mono font-bold text-slate-800">
            {kpis.averagePace}% <span className="text-xs font-normal text-slate-400">/</span> {kpis.averageFatigue}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Médias das Operações</div>
        </div>
      </div>

      {/* Gráfico de Balanceamento de Linha (SVG / Tailwind) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Gráfico de Balanceamento de Linha (Tempo Padrão por Operação)
            </h4>
            <p className="text-xs text-slate-500">
              Visualização dos tempos de ciclo (minutos centesimais) e postos necessários por operação.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Normal (&le; 1.5 postos)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Médio (1.5 - 2 postos)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-rose-500 inline-block" /> Gargalo (&gt; 2 postos)
            </span>
          </div>
        </div>

        {operations.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Nenhuma operação cadastrada neste modelo.
          </div>
        ) : (
          <div className="space-y-2.5 pt-1">
            {operations.map((op) => {
              const widthPct = maxTime > 0 ? (op.standardTime / maxTime) * 100 : 0;
              const isBottleneck = op.requiredWorkstations > 2.0;
              const isWarning = op.requiredWorkstations > 1.5 && !isBottleneck;

              return (
                <div
                  key={op.id}
                  onClick={() => onSelectOperation && onSelectOperation(op)}
                  className="group cursor-pointer hover:bg-slate-50/80 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {op.code}
                      </span>
                      <span className="font-semibold text-slate-700 truncate max-w-[240px] sm:max-w-[360px]">
                        {op.name}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize hidden sm:inline">
                        ({op.type})
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-500 text-[11px]">
                        TC: {op.measuredTimeSexagesimal} ({op.measuredTimeCentesimal.toFixed(2)}m)
                      </span>
                      <span className="font-bold text-slate-900 text-xs">
                        TP: {op.standardTime.toFixed(2)} min
                      </span>
                      <span
                        className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                          isBottleneck
                            ? 'bg-rose-100 text-rose-800'
                            : isWarning
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {op.requiredWorkstations.toFixed(1)} postos
                      </span>
                    </div>
                  </div>

                  {/* Barra horizontal proporcional */}
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isBottleneck
                          ? 'bg-rose-500 group-hover:bg-rose-600'
                          : isWarning
                          ? 'bg-amber-500 group-hover:bg-amber-600'
                          : 'bg-emerald-500 group-hover:bg-emerald-600'
                      }`}
                      style={{ width: `${Math.max(widthPct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
