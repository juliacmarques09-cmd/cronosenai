import React, { useState } from 'react';
import { X, Check, Sliders, ShieldAlert, Sparkles, BookOpen, Layers } from 'lucide-react';
import { WestinghouseRating } from '../types/industrial';
import {
  WESTINGHOUSE_SKILL_OPTIONS,
  WESTINGHOUSE_EFFORT_OPTIONS,
  WESTINGHOUSE_CONDITIONS_OPTIONS,
  WESTINGHOUSE_CONSISTENCY_OPTIONS,
  WESTINGHOUSE_PRESETS,
  calculateTotalTolerance,
  DEFAULT_WESTINGHOUSE_RATING,
} from '../utils/westinghouse';

interface WestinghouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRating?: WestinghouseRating;
  onSave: (rating: WestinghouseRating, totalTolerancePercent: number, category: 'leve' | 'moderada' | 'pesada') => void;
  operationName: string;
}

export const WestinghouseModal: React.FC<WestinghouseModalProps> = ({
  isOpen,
  onClose,
  currentRating,
  onSave,
  operationName,
}) => {
  const [rating, setRating] = useState<WestinghouseRating>(
    currentRating || DEFAULT_WESTINGHOUSE_RATING
  );

  if (!isOpen) return null;

  const { westinghouseFactor, ergonomicTolerancePercent, totalTolerancePercent, category } =
    calculateTotalTolerance(rating);

  const handlePresetSelect = (presetId: string) => {
    const found = WESTINGHOUSE_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setRating({ ...found.rating });
    }
  };

  const handleSave = () => {
    onSave(rating, totalTolerancePercent, category);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Tabela Westinghouse & Tolerâncias Ergonômicas</h2>
              <p className="text-xs text-slate-400">
                Operação: <span className="text-amber-300 font-semibold">{operationName}</span>
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
          {/* Templates Pré-configurados */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Templates Rápidos por Tipo de Atividade
              </span>
              <span className="text-xs text-slate-500">1-Clique para aplicar</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {WESTINGHOUSE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-slate-800 group-hover:text-amber-900 truncate">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">{preset.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Os 4 Fatores de Westinghouse */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Fatores de Desempenho Westinghouse (4 Pilares)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                Fator: {westinghouseFactor >= 0 ? `+${westinghouseFactor.toFixed(3)}` : westinghouseFactor.toFixed(3)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Habilidade */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Habilidade (Skill)
                </label>
                <select
                  value={rating.skill.code}
                  onChange={(e) => {
                    const opt = WESTINGHOUSE_SKILL_OPTIONS.find((o) => o.code === e.target.value);
                    if (opt) {
                      setRating((prev) => ({
                        ...prev,
                        skill: { code: opt.code, description: opt.name, factor: opt.value },
                      }));
                    }
                  }}
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {WESTINGHOUSE_SKILL_OPTIONS.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.name} ({opt.value >= 0 ? `+${opt.value}` : opt.value})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">{rating.skill.description}</p>
              </div>

              {/* 2. Esforço */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Esforço (Effort)
                </label>
                <select
                  value={rating.effort.code}
                  onChange={(e) => {
                    const opt = WESTINGHOUSE_EFFORT_OPTIONS.find((o) => o.code === e.target.value);
                    if (opt) {
                      setRating((prev) => ({
                        ...prev,
                        effort: { code: opt.code, description: opt.name, factor: opt.value },
                      }));
                    }
                  }}
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {WESTINGHOUSE_EFFORT_OPTIONS.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.name} ({opt.value >= 0 ? `+${opt.value}` : opt.value})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">{rating.effort.description}</p>
              </div>

              {/* 3. Condições */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3. Condições Ambientais (Conditions)
                </label>
                <select
                  value={rating.conditions.code}
                  onChange={(e) => {
                    const opt = WESTINGHOUSE_CONDITIONS_OPTIONS.find((o) => o.code === e.target.value);
                    if (opt) {
                      setRating((prev) => ({
                        ...prev,
                        conditions: { code: opt.code, description: opt.name, factor: opt.value },
                      }));
                    }
                  }}
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {WESTINGHOUSE_CONDITIONS_OPTIONS.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.name} ({opt.value >= 0 ? `+${opt.value}` : opt.value})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">{rating.conditions.description}</p>
              </div>

              {/* 4. Consistência */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  4. Consistência (Consistency)
                </label>
                <select
                  value={rating.consistency.code}
                  onChange={(e) => {
                    const opt = WESTINGHOUSE_CONSISTENCY_OPTIONS.find((o) => o.code === e.target.value);
                    if (opt) {
                      setRating((prev) => ({
                        ...prev,
                        consistency: { code: opt.code, description: opt.name, factor: opt.value },
                      }));
                    }
                  }}
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {WESTINGHOUSE_CONSISTENCY_OPTIONS.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.name} ({opt.value >= 0 ? `+${opt.value}` : opt.value})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">{rating.consistency.description}</p>
              </div>
            </div>
          </div>

          {/* Tolerâncias de Fadiga e Necessidades Pessoais (Sliders) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Tolerâncias Ergonômicas & Fadiga Fisiológica (Sliders)
              </span>
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Subtotal Ergonômico: {ergonomicTolerancePercent}%
              </span>
            </div>

            <div className="space-y-4">
              {/* Necessidades Pessoais */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Necessidades Pessoais (Água, Sanitário, Descanso)</span>
                  <span className="text-amber-800 font-mono font-bold">{rating.personalNeeds}%</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="1"
                  value={rating.personalNeeds}
                  onChange={(e) =>
                    setRating((prev) => ({ ...prev, personalNeeds: parseInt(e.target.value) || 5 }))
                  }
                  className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>3% (Mínimo estrito)</span>
                  <span>5% (Padrão OIT recomendado)</span>
                  <span>10% (Turno estendido)</span>
                </div>
              </div>

              {/* Fadiga Básica / Esforço Físico */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Fadiga Básica & Esforço Físico</span>
                  <span className="text-amber-800 font-mono font-bold">{rating.fatigueFactor}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="18"
                  step="1"
                  value={rating.fatigueFactor}
                  onChange={(e) =>
                    setRating((prev) => ({ ...prev, fatigueFactor: parseInt(e.target.value) || 4 }))
                  }
                  className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>2% (Sentado / Leve)</span>
                  <span>8% (Moderado / Movimentação)</span>
                  <span>18% (Pesado / Esforço contínuo)</span>
                </div>
              </div>

              {/* Postura de Trabalho */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Sobrecarga Postural (Em pé, Curvado ou Agachado)</span>
                  <span className="text-amber-800 font-mono font-bold">{rating.postureFactor}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="1"
                  value={rating.postureFactor}
                  onChange={(e) =>
                    setRating((prev) => ({ ...prev, postureFactor: parseInt(e.target.value) || 0 }))
                  }
                  className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>0% (Sentado ergonômico)</span>
                  <span>3% (Em pé contínuo)</span>
                  <span>8% (Postura forçada / torção)</span>
                </div>
              </div>

              {/* Condições Especiais */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Condições Especiais (Ruído, Calor ou Tensão Mental)</span>
                  <span className="text-amber-800 font-mono font-bold">{rating.specialFactor}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="1"
                  value={rating.specialFactor}
                  onChange={(e) =>
                    setRating((prev) => ({ ...prev, specialFactor: parseInt(e.target.value) || 0 }))
                  }
                  className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Resultado Consolidado da Tolerância */}
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow ${
                  category === 'leve'
                    ? 'bg-emerald-600'
                    : category === 'moderada'
                    ? 'bg-amber-600'
                    : 'bg-rose-600'
                }`}
              >
                {totalTolerancePercent}%
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-slate-600">
                  Tolerância Total Aplicada (FT)
                </div>
                <div className="text-sm font-extrabold text-slate-900 capitalize flex items-center gap-1.5">
                  Classificação: <span className="text-amber-900">{category}</span>
                  <span
                    className={`px-2 py-0.5 text-[11px] rounded-full font-semibold uppercase ${
                      category === 'leve'
                        ? 'bg-emerald-100 text-emerald-800'
                        : category === 'moderada'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {category === 'leve'
                      ? 'Até 11% (Baixo Desgaste)'
                      : category === 'moderada'
                      ? '12% a 18% (Padrão Fabril)'
                      : '> 18% (Alerta Ergonômico)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-600 font-mono">
              <div>TP = TN × (1 + {totalTolerancePercent}%)</div>
              <div className="text-[11px] text-slate-500">Multiplicador: ×{(1 + totalTolerancePercent / 100).toFixed(4)}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow transition-all"
          >
            <Check className="w-4 h-4" />
            Aplicar Tolerância ({totalTolerancePercent}%)
          </button>
        </div>
      </div>
    </div>
  );
};
