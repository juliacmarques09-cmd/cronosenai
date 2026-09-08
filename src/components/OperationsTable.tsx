import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Printer,
  Edit2,
  Trash2,
  Clock,
  Sliders,
  AlertTriangle,
  Cpu,
  User,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { Operation, OperationType, ProductModel } from '../types/industrial';

interface OperationsTableProps {
  model: ProductModel;
  onEditOperation: (op: Operation) => void;
  onNewOperation: () => void;
  onDeleteOperation: (id: string) => void;
  onSelectForStopwatch: (id: string) => void;
  onPrintOperation: (op: Operation) => void;
}

export const OperationsTable: React.FC<OperationsTableProps> = ({
  model,
  onEditOperation,
  onNewOperation,
  onDeleteOperation,
  onSelectForStopwatch,
  onPrintOperation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | OperationType>('all');

  const operations = model.operations || [];

  const filteredOperations = operations.filter((op) => {
    const matchesSearch =
      op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (op.machineName && op.machineName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || op.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Barra de Ações e Filtros */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar operação, código ou máquina..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <div className="flex bg-white border border-slate-300 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                typeFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setTypeFilter('manual')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                typeFilter === 'manual' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Manuais
            </button>
            <button
              onClick={() => setTypeFilter('machine')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                typeFilter === 'machine' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Máquinas
            </button>
          </div>
        </div>

        <button
          onClick={onNewOperation}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nova Operação
        </button>
      </div>

      {/* Tabela de Operações */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-700 tracking-wider">
              <th className="py-3 px-3">Cód.</th>
              <th className="py-3 px-3">Operação / Tipo</th>
              <th className="py-3 px-3 text-right">Tempo Cronometrado</th>
              <th className="py-3 px-3 text-center">Ritmo</th>
              <th className="py-3 px-3 text-center">Tolerância</th>
              <th className="py-3 px-3 text-right">Tempo Padrão (TP)</th>
              <th className="py-3 px-3 text-right">Capacidade / Hora</th>
              <th className="py-3 px-3 text-right">Capacidade / Dia</th>
              <th className="py-3 px-3 text-right">Postos Requeridos</th>
              <th className="py-3 px-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredOperations.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
                  {searchTerm ? 'Nenhuma operação encontrada com esse termo.' : 'Nenhuma operação cadastrada neste modelo.'}
                </td>
              </tr>
            ) : (
              filteredOperations.map((op) => {
                const isBottleneck = op.requiredWorkstations > 2.0;

                return (
                  <tr
                    key={op.id}
                    className={`hover:bg-amber-50/40 transition-colors ${
                      isBottleneck ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    {/* Código */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                          {op.code}
                        </span>
                        {isBottleneck && (
                          <span title="Gargalo de Produção (Postos > 2)">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Nome e Tipo */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{op.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`capitalize font-medium ${
                            op.type === 'manual'
                              ? 'text-indigo-700'
                              : op.type === 'machine'
                              ? 'text-emerald-700'
                              : 'text-purple-700'
                          }`}
                        >
                          {op.type === 'manual' ? 'Manual' : op.type === 'machine' ? 'Máquina' : 'Misto'}
                        </span>
                        {op.machineName && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[180px]">{op.machineName}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Tempo Cronometrado (Sexag e Centes) */}
                    <td className="py-3 px-3 text-right font-mono whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        {op.measuredTimeCentesimal.toFixed(2)} min
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ({op.measuredTimeSexagesimal}s)
                      </div>
                    </td>

                    {/* Fator de Ritmo */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                        {op.workPace}%
                      </span>
                    </td>

                    {/* Tolerância de Fadiga */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          op.fatigueCategory === 'leve'
                            ? 'bg-emerald-100 text-emerald-800'
                            : op.fatigueCategory === 'moderada'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {op.fatigueTolerancePercent}% ({op.fatigueCategory})
                      </span>
                    </td>

                    {/* Tempo Padrão (TP) */}
                    <td className="py-3 px-3 text-right font-mono whitespace-nowrap">
                      <div className="font-bold text-slate-950 text-sm">
                        {op.standardTime.toFixed(2)} min
                      </div>
                      <div className="text-[10px] text-slate-500">
                        TN: {op.normalTime.toFixed(2)}m
                      </div>
                    </td>

                    {/* Peças / Hora */}
                    <td className="py-3 px-3 text-right font-mono whitespace-nowrap font-semibold text-emerald-700">
                      {op.piecesPerHour.toFixed(1)} <span className="text-[10px] text-slate-400 font-normal">pçs</span>
                    </td>

                    {/* Peças / Dia (8.8h) */}
                    <td className="py-3 px-3 text-right font-mono whitespace-nowrap font-semibold text-sky-700">
                      {op.piecesPerDay.toFixed(0)} <span className="text-[10px] text-slate-400 font-normal">pçs</span>
                    </td>

                    {/* Postos de Trabalho Necessários */}
                    <td className="py-3 px-3 text-right font-mono whitespace-nowrap">
                      <div
                        className={`font-bold text-sm ${
                          isBottleneck ? 'text-rose-700' : 'text-slate-900'
                        }`}
                      >
                        {op.requiredWorkstations.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {Math.ceil(op.requiredWorkstations)} op.
                      </div>
                    </td>

                    {/* Botões de Ação */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onSelectForStopwatch(op.id)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Carregar no Cronômetro Digital"
                        >
                          <Clock className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onPrintOperation(op)}
                          className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                          title="Imprimir Relatório Simplificado da Operação"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEditOperation(op)}
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          title="Editar Parâmetros da Operação"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Excluir a operação ${op.code} - ${op.name}?`)) {
                              onDeleteOperation(op.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                          title="Excluir Operação"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
