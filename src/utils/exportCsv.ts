import { ProductModel } from '../types/industrial';

export function exportModelToCsv(model: ProductModel): void {
  const headers = [
    'Código Op',
    'Nome da Operação',
    'Tipo',
    'Máquina/Dispositivo',
    'Tempo Sexagesimal (MM:SS)',
    'Tempo Centesimal (min)',
    'Ritmo (%)',
    'Tempo Normal (min)',
    'Tolerância Westinghouse (%)',
    'Classificação Fadiga',
    'Tempo Padrão (min)',
    'Produção por Hora (peças/h)',
    'Produção por Dia (peças/dia 8.8h)',
    'Demanda Diária (peças)',
    'Postos de Trabalho Necessários',
  ];

  const rows = model.operations.map((op) => [
    `"${op.code}"`,
    `"${op.name.replace(/"/g, '""')}"`,
    `"${op.type === 'manual' ? 'Manual' : op.type === 'machine' ? 'Máquina' : 'Misto'}"`,
    `"${(op.machineName || '-').replace(/"/g, '""')}"`,
    `"${op.measuredTimeSexagesimal}"`,
    op.measuredTimeCentesimal.toFixed(2).replace('.', ','),
    `${op.workPace}%`,
    op.normalTime.toFixed(4).replace('.', ','),
    `${op.fatigueTolerancePercent}%`,
    `"${op.fatigueCategory}"`,
    op.standardTime.toFixed(4).replace('.', ','),
    op.piecesPerHour.toFixed(1).replace('.', ','),
    op.piecesPerDay.toFixed(0),
    model.dailyDemand,
    op.requiredWorkstations.toFixed(2).replace('.', ','),
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Cronoanalise_${model.code || 'Modelo'}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
