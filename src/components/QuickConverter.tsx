import React, { useState } from 'react';
import { ArrowRightLeft, Clock, Calculator, Info, Check } from 'lucide-react';
import { sexagesimalToCentesimal, centesimalToSexagesimal } from '../utils/timeConversion';

interface QuickConverterProps {
  onApplyToActive?: (centesimal: number, sexagesimal: string) => void;
}

export const QuickConverter: React.FC<QuickConverterProps> = ({ onApplyToActive }) => {
  const [sexInput, setSexInput] = useState('01:30');
  const [centInput, setCentInput] = useState('1.50');
  const [mode, setMode] = useState<'sexToCent' | 'centToSex'>('sexToCent');
  const [copied, setCopied] = useState(false);

  const sexResult = sexagesimalToCentesimal(sexInput);
  const centResult = centesimalToSexagesimal(parseFloat(centInput) || 0);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Conversor Industrial de Tempos</h3>
            <p className="text-xs text-slate-400">Precisão sexagesimal (MM:SS) ↔ centesimal (DM/CM)</p>
          </div>
        </div>
        <div className="flex bg-slate-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setMode('sexToCent')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              mode === 'sexToCent' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            MM:SS ➔ Centesimal
          </button>
          <button
            onClick={() => setMode('centToSex')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              mode === 'centToSex' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Centesimal ➔ MM:SS
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {mode === 'sexToCent' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Tempo Sexagesimal (Minutos : Segundos)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={sexInput}
                  onChange={(e) => setSexInput(e.target.value)}
                  placeholder="01:30 ou 90"
                  className="w-full pl-10 pr-4 py-2.5 text-lg font-mono font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
                <Clock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              </div>
              <p className="text-xs text-slate-500 mt-1">Exemplos: 00:45, 01:30, 02:15.5</p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-xs font-semibold text-amber-900 uppercase tracking-wide mb-1">
                Resultado Centesimal Equivalente
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-mono font-bold text-slate-900">
                    {sexResult.centesimalMinutes.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-slate-600 ml-1">minutos</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-amber-700">
                    {sexResult.centesimalHundredths.toFixed(0)}
                  </span>
                  <span className="text-xs text-amber-800 ml-1 font-medium">centiminutos (CM)</span>
                </div>
              </div>
              <div className="text-xs text-amber-800 font-mono mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between">
                <span>Fórmula: {sexResult.explanation}</span>
                <button
                  onClick={() => handleCopy(sexResult.centesimalMinutes.toFixed(2))}
                  className="text-amber-900 font-medium hover:underline flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                  Copiar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Minutos Centesimais (DM / Deciminutos)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={centInput}
                  onChange={(e) => setCentInput(e.target.value)}
                  placeholder="1.50"
                  className="w-full pl-10 pr-4 py-2.5 text-lg font-mono font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
                <Calculator className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              </div>
              <p className="text-xs text-slate-500 mt-1">Exemplos: 0.50, 1.25, 1.75, 2.50</p>
            </div>

            <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg">
              <div className="text-xs font-semibold text-sky-900 uppercase tracking-wide mb-1">
                Resultado Sexagesimal (Relógio Padrão)
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-mono font-bold text-slate-900">
                    {centResult.sexagesimalFormatted}
                  </span>
                  <span className="text-sm font-semibold text-slate-600 ml-1">MM:SS</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-sky-800">
                    {centResult.totalSeconds.toFixed(1)}s
                  </span>
                  <span className="text-xs text-sky-700 ml-1">totais</span>
                </div>
              </div>
              <div className="text-xs text-sky-800 font-mono mt-2 pt-2 border-t border-sky-200/60 flex items-center justify-between">
                <span>Cálculo: {centResult.explanation}</span>
                <button
                  onClick={() => handleCopy(centResult.sexagesimalFormatted)}
                  className="text-sky-900 font-medium hover:underline flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                  Copiar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabela de Referência Rápida para o Cronoanalista */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            Tabela de Equivalências Práticas (Engenharia de Métodos)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500">15 seg</span> = <b className="text-amber-700">0,25 min</b> (25 CM)
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500">30 seg</span> = <b className="text-amber-700">0,50 min</b> (50 CM)
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500">45 seg</span> = <b className="text-amber-700">0,75 min</b> (75 CM)
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500">60 seg</span> = <b className="text-amber-700">1,00 min</b> (100 CM)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
