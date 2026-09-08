import React, { useState, useEffect } from 'react';
import { X, Check, Box, Trash2 } from 'lucide-react';
import { ProductModel } from '../types/industrial';

interface ModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: ProductModel | null;
  onSave: (modelData: Partial<ProductModel>) => void;
  onDelete?: (modelId: string) => void;
}

export const ModelModal: React.FC<ModelModalProps> = ({
  isOpen,
  onClose,
  model,
  onSave,
  onDelete,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dailyDemand, setDailyDemand] = useState(400);
  const [workShiftHours, setWorkShiftHours] = useState(8.8);

  useEffect(() => {
    if (model) {
      setCode(model.code);
      setName(model.name);
      setDescription(model.description);
      setDailyDemand(model.dailyDemand);
      setWorkShiftHours(model.workShiftHours || 8.8);
    } else {
      setCode('MOD-' + String(Math.floor(Math.random() * 800) + 100));
      setName('');
      setDescription('');
      setDailyDemand(400);
      setWorkShiftHours(8.8);
    }
  }, [model, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      dailyDemand: Number(dailyDemand) || 400,
      workShiftHours: Number(workShiftHours) || 8.8,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {model ? 'Editar Modelo / Produto' : 'Cadastrar Novo Modelo Industrial'}
              </h2>
              <p className="text-xs text-slate-400">
                Parâmetros de demanda diária e jornada de trabalho
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Código do Modelo / Peça
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="MOD-VH450"
              className="w-full text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Nome do Modelo / Produto *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Válvula Reguladora Hidráulica VH-450"
              className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Descrição e Especificações
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Materiais, linhas de montagem aplicáveis, etc..."
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Demanda Diária (peças/dia)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={dailyDemand}
                onChange={(e) => setDailyDemand(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">Usado no cálculo de postos</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Jornada Diária (Horas)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                step="0.1"
                value={workShiftHours}
                onChange={(e) => setWorkShiftHours(parseFloat(e.target.value) || 8.8)}
                className="w-full text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">Padrão 8,8h = 528 min</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            {model && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Excluir permanentemente o modelo ${model.name}?`)) {
                    onDelete(model.id);
                    onClose();
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Excluir Modelo
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-sm"
              >
                <Check className="w-4 h-4" />
                Salvar Modelo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
