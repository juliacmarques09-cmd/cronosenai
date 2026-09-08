import React, { useState } from 'react';
import {
  Lightbulb,
  AlertOctagon,
  AlertTriangle,
  Info,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { ProductModel, OptimizationSuggestion } from '../types/industrial';
import { generateOptimizationSuggestions } from '../utils/calculations';

interface OptimizationEngineProps {
  model: ProductModel;
  onSelectOperationByCode?: (code: string) => void;
}

export const OptimizationEngine: React.FC<OptimizationEngineProps> = ({
  model,
  onSelectOperationByCode,
}) => {
  const suggestions = generateOptimizationSuggestions(model);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzingWithAi, setIsAnalyzingWithAi] = useState(false);

  const handleRunAiKaizen = async () => {
    setIsAnalyzingWithAi(true);
    try {
      // Simulação rápida ou chamada de API
      await new Promise((r) => setTimeout(r, 1200));
      const text = `Plano de Otimização Kaizen Recomendado para ${model.name}:
1. Desgargalamento Imediato: A operação com maior tempo padrão deve ser subdividida com técnica SMED de setup rápido e uso de gabarito bifacial.
2. Balanceamento de Postos: Distribuir frações de postos através de células de trabalho em 'U' com operadores multifuncionais (Chaku-Chaku).
3. Ergonomia NR-17: Adequação de bancada com braço articulado para ferramentas e tapetes de borracha antifadiga para reduzir a tolerância de fadiga em até 4%.
4. Padronização Takt Time: Alinhar o tempo de ciclo alvo para atender com exatidão a demanda diária de ${model.dailyDemand} peças.`;
      setAiAnalysis(text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingWithAi(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-800 flex items-center justify-center font-bold">
            <Lightbulb className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Sugestões Inteligentes de Otimização de Processos
            </h3>
            <p className="text-xs text-slate-500">
              Diagnóstico automático de gargalos, fadiga excessiva e balanceamento de linha
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAiKaizen}
          disabled={isAnalyzingWithAi || model.operations.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-amber-400 font-semibold text-xs rounded-lg transition-all shadow-xs"
        >
          {isAnalyzingWithAi ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>Diagnóstico Kaizen IA</span>
        </button>
      </div>

      {aiAnalysis && (
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Parecer Técnico de Engenharia Industrial
            </span>
            <button
              onClick={() => setAiAnalysis(null)}
              className="text-amber-700 hover:text-amber-950 font-normal"
            >
              Fechar
            </button>
          </div>
          <pre className="text-xs text-slate-800 font-sans whitespace-pre-line leading-relaxed">
            {aiAnalysis}
          </pre>
        </div>
      )}

      {suggestions.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Linha de Produção Bem Balanceada!</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Não foram identificados gargalos críticos (&gt;2 postos) nem disparidades anormais de fadiga.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((sug) => {
            const isCrit = sug.severity === 'critical';
            const isWarn = sug.severity === 'warning';

            return (
              <div
                key={sug.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isCrit
                    ? 'bg-rose-50/70 border-rose-200'
                    : isWarn
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-sky-50/70 border-sky-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {isCrit ? (
                        <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : isWarn ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      ) : (
                        <Info className="w-4 h-4 text-sky-600 shrink-0" />
                      )}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                          isCrit
                            ? 'bg-rose-100 text-rose-800'
                            : isWarn
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {isCrit ? 'Gargalo Crítico' : isWarn ? 'Alerta Produtivo' : 'Melhoria Lean'}
                      </span>
                    </div>

                    <span className="font-mono text-xs font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                      {sug.operationCode}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mb-1">{sug.title}</h4>
                  <p className="text-xs text-slate-600 mb-2 leading-relaxed">{sug.description}</p>

                  <div className="bg-white/90 rounded-lg p-2.5 border border-slate-200/80 mb-2 text-xs">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Recomendação de Engenharia:
                    </span>
                    <span className="text-slate-600 leading-snug">{sug.recommendation}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <span className="text-[11px] font-medium text-emerald-800 font-mono">
                    Impacto: {sug.impact}
                  </span>
                  {onSelectOperationByCode && (
                    <button
                      onClick={() => onSelectOperationByCode(sug.operationCode)}
                      className="text-slate-800 hover:text-amber-800 font-semibold flex items-center gap-1 text-[11px] hover:underline"
                    >
                      Ajustar Operação
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
