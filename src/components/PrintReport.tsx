import React from 'react';
import { Printer, ArrowLeft, Download, Check, FileText } from 'lucide-react';
import { ProductModel, Operation } from '../types/industrial';
import { calculateLineBalanceKPIs } from '../utils/calculations';

interface PrintReportProps {
  model: ProductModel;
  singleOperation?: Operation | null;
  onBack: () => void;
}

export const PrintReport: React.FC<PrintReportProps> = ({ model, singleOperation, onBack }) => {
  const kpis = calculateLineBalanceKPIs(model);
  const now = new Date().toLocaleString('pt-BR');

  const handlePrint = () => {
    window.print();
  };

  const operationsToShow = singleOperation ? [singleOperation] : model.operations;

  return (
    <div className="bg-white min-h-screen text-slate-900 p-4 sm:p-8 font-sans">
      {/* Barra de Ação Superior (não impressa) */}
      <div className="no-print max-w-5xl mx-auto mb-6 flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl shadow-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Sistema
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Dica: No diálogo de impressão, selecione "Salvar como PDF".
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Salvar em PDF
          </button>
        </div>
      </div>

      {/* Folha do Relatório Oficial (Formatado para A4 / Impressão) */}
      <div className="max-w-5xl mx-auto border border-slate-300 rounded-xl p-8 shadow-xs bg-white text-slate-900 printable-sheet">
        {/* Cabeçalho Industrial Oficial */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest font-extrabold text-slate-500">
                Engenharia de Métodos e Processos Industriais
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 mt-0.5">
                {singleOperation
                  ? 'FOLHA DE OPERAÇÃO PADRÃO & CRONOANÁLISE'
                  : 'RELATÓRIO DE ESTUDO DE TEMPOS & BALANCEAMENTO DE LINHA'}
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Conforme norma técnica Westinghouse e cálculo de capacidade produtiva industrial.
              </p>
            </div>
            <div className="text-right font-mono text-xs text-slate-600">
              <div className="font-bold text-slate-900">DOC: CRONO-{model.code || 'MOD'}</div>
              <div>Emissão: {now}</div>
              <div className="text-[11px] text-slate-500">Status: Aprovado para Fabricação</div>
            </div>
          </div>

          {/* Dados do Produto / Modelo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 mt-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold font-sans">
                Modelo / Produto
              </span>
              <span className="font-bold text-slate-900">{model.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold font-sans">
                Código do Modelo
              </span>
              <span className="font-bold text-slate-900">{model.code}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold font-sans">
                Demanda Diária Programada
              </span>
              <span className="font-bold text-slate-900">{model.dailyDemand} peças/dia</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold font-sans">
                Jornada Diária (Turno)
              </span>
              <span className="font-bold text-slate-900">
                {model.workShiftHours}h ({model.workShiftHours * 60} min úteis)
              </span>
            </div>
          </div>
        </div>

        {/* Resumo de Indicadores Gerais da Linha (se for relatório completo) */}
        {!singleOperation && (
          <div className="mb-6 avoid-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Resumo Consolidado da Linha de Produção
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
              <div className="border border-slate-200 p-2.5 rounded bg-slate-50">
                <div className="text-[10px] text-slate-500 font-sans uppercase font-bold">
                  Tempo Ciclo Total
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {kpis.totalCycleTimeMinutes.toFixed(2)} min
                </div>
              </div>
              <div className="border border-slate-200 p-2.5 rounded bg-slate-50">
                <div className="text-[10px] text-slate-500 font-sans uppercase font-bold">
                  Operação Gargalo
                </div>
                <div className="text-base font-bold text-rose-700 mt-0.5">
                  {kpis.bottleneckOperation ? kpis.bottleneckOperation.code : '-'}
                </div>
              </div>
              <div className="border border-slate-200 p-2.5 rounded bg-slate-50">
                <div className="text-[10px] text-slate-500 font-sans uppercase font-bold">
                  Capacidade / Hora
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {kpis.lineCapacityPerHour.toFixed(0)} pçs/h
                </div>
              </div>
              <div className="border border-slate-200 p-2.5 rounded bg-slate-50">
                <div className="text-[10px] text-slate-500 font-sans uppercase font-bold">
                  Capacidade / Dia (8.8h)
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {kpis.lineCapacityPerDay.toFixed(0)} pçs/dia
                </div>
              </div>
              <div className="border border-slate-200 p-2.5 rounded bg-slate-50">
                <div className="text-[10px] text-slate-500 font-sans uppercase font-bold">
                  Postos de Trabalho
                </div>
                <div className="text-base font-bold text-purple-700 mt-0.5">
                  {kpis.totalWorkstations.toFixed(1)} ({Math.ceil(kpis.totalWorkstations)} op.)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabela Detalhada das Operações */}
        <div className="mb-6 avoid-break">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Detalhamento das Operações, Fatores e Cálculos
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold uppercase text-slate-700 tracking-wider">
                  <th className="p-2 border-r border-slate-300">Cód</th>
                  <th className="p-2 border-r border-slate-300">Operação & Método</th>
                  <th className="p-2 border-r border-slate-300 text-center">Tipo</th>
                  <th className="p-2 border-r border-slate-300 text-right">TC Sexag.</th>
                  <th className="p-2 border-r border-slate-300 text-right">TC Centes.</th>
                  <th className="p-2 border-r border-slate-300 text-center">Ritmo</th>
                  <th className="p-2 border-r border-slate-300 text-center">Tolerância (FT)</th>
                  <th className="p-2 border-r border-slate-300 text-right">TP (min)</th>
                  <th className="p-2 border-r border-slate-300 text-right">Peças / Hora</th>
                  <th className="p-2 border-r border-slate-300 text-right">Peças / Dia</th>
                  <th className="p-2 text-right">Postos Requeridos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {operationsToShow.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-900 border-r border-slate-200">
                      {op.code}
                    </td>
                    <td className="p-2 border-r border-slate-200 font-sans">
                      <div className="font-bold text-slate-900">{op.name}</div>
                      {op.machineName && (
                        <div className="text-[10px] text-slate-500">Eq: {op.machineName}</div>
                      )}
                      {op.description && (
                        <div className="text-[10px] text-slate-500 italic truncate max-w-[200px]">
                          {op.description}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-center border-r border-slate-200 capitalize font-sans text-[11px]">
                      {op.type === 'manual' ? 'Manual' : op.type === 'machine' ? 'Máquina' : 'Misto'}
                    </td>
                    <td className="p-2 text-right border-r border-slate-200">
                      {op.measuredTimeSexagesimal}
                    </td>
                    <td className="p-2 text-right border-r border-slate-200 font-bold">
                      {op.measuredTimeCentesimal.toFixed(2)}
                    </td>
                    <td className="p-2 text-center border-r border-slate-200">{op.workPace}%</td>
                    <td className="p-2 text-center border-r border-slate-200">
                      <span>{op.fatigueTolerancePercent}%</span>{' '}
                      <span className="text-[10px] text-slate-500 capitalize">
                        ({op.fatigueCategory})
                      </span>
                    </td>
                    <td className="p-2 text-right border-r border-slate-200 font-bold text-slate-900">
                      {op.standardTime.toFixed(2)}
                    </td>
                    <td className="p-2 text-right border-r border-slate-200">
                      {op.piecesPerHour.toFixed(1)}
                    </td>
                    <td className="p-2 text-right border-r border-slate-200">
                      {op.piecesPerDay.toFixed(0)}
                    </td>
                    <td
                      className={`p-2 text-right font-bold ${
                        op.requiredWorkstations > 2 ? 'text-rose-700 bg-rose-50' : 'text-slate-900'
                      }`}
                    >
                      {op.requiredWorkstations.toFixed(2)}{' '}
                      <span className="text-[10px] font-normal text-slate-500 font-sans">
                        ({Math.ceil(op.requiredWorkstations)} op.)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fórmulas e Notas de Engenharia */}
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-[11px] text-slate-600 mb-8 avoid-break space-y-1">
          <div className="font-bold text-slate-800 uppercase">Fórmulas e Notas de Engenharia:</div>
          <div>
            • <b>Conversão Centesimal:</b> Minuto Centesimal = Segundos Totais ÷ 60 (1 min = 100 centiminutos).
          </div>
          <div>
            • <b>Tempo Normal (TN):</b> TN = Tempo Cronometrado × (Fator de Ritmo ÷ 100).
          </div>
          <div>
            • <b>Tempo Padrão (TP):</b> TP = TN × (1 + Tolerância Westinghouse ÷ 100).
          </div>
          <div>
            • <b>Produção por Turno:</b> Peças/Dia = (8,8h × 60 min) ÷ TP = 528 min ÷ TP.
          </div>
          <div>
            • <b>Postos de Trabalho Necessários:</b> Postos = Demanda Diária ({model.dailyDemand} pçs) ÷ Produção Diária da Operação.
          </div>
        </div>

        {/* Campo de Assinatura e Validação Formal */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-8 border-t-2 border-slate-300 avoid-break text-center text-xs font-mono">
          <div>
            <div className="border-b border-slate-800 pb-1 mb-1 font-bold text-slate-900">
              Cronoanalista Responsável
            </div>
            <div className="text-[10px] text-slate-500 font-sans">Assinatura & CREA / Matrícula</div>
          </div>
          <div>
            <div className="border-b border-slate-800 pb-1 mb-1 font-bold text-slate-900">
              Supervisor de Produção
            </div>
            <div className="text-[10px] text-slate-500 font-sans">Validação Operacional</div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="border-b border-slate-800 pb-1 mb-1 font-bold text-slate-900">
              Gerente Industrial / PCP
            </div>
            <div className="text-[10px] text-slate-500 font-sans">Aprovação de Capacidade</div>
          </div>
        </div>
      </div>
    </div>
  );
};
