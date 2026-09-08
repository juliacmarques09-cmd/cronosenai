import { Operation, ProductModel, OptimizationSuggestion, LineBalanceKPIs } from '../types/industrial';

/**
 * Recalcula todos os tempos e métricas de produção de uma operação
 */
export function calculateOperationMetrics(
  measuredTimeCentesimal: number, // TC em minutos
  workPace: number, // Ritmo % (ex: 100)
  fatigueTolerancePercent: number, // Tolerância % (ex: 14)
  dailyDemand: number = 500, // Demanda diária do modelo
  workShiftHours: number = 8.8 // 8.8 horas = 528 minutos
): {
  normalTime: number;
  standardTime: number;
  piecesPerHour: number;
  piecesPerDay: number;
  requiredWorkstations: number;
  fatigueCategory: 'leve' | 'moderada' | 'pesada';
} {
  // Se tempo zerado
  if (measuredTimeCentesimal <= 0) {
    return {
      normalTime: 0,
      standardTime: 0,
      piecesPerHour: 0,
      piecesPerDay: 0,
      requiredWorkstations: 0,
      fatigueCategory: 'leve',
    };
  }

  // 1. Tempo Normal (TN) = TC * (Ritmo / 100)
  const normalTime = measuredTimeCentesimal * (workPace / 100);

  // 2. Tempo Padrão (TP) = TN * (1 + Tolerância / 100)
  const standardTime = normalTime * (1 + fatigueTolerancePercent / 100);

  // 3. Produção por Hora = 60 minutos / TP
  const piecesPerHour = standardTime > 0 ? 60 / standardTime : 0;

  // 4. Produção Diária (8,8 horas padrão = 528 minutos)
  const minutesPerShift = workShiftHours * 60;
  const piecesPerDay = standardTime > 0 ? minutesPerShift / standardTime : 0;

  // 5. Postos de Trabalho Necessários = Demanda Diária / Produção Diária
  const requiredWorkstations = piecesPerDay > 0 ? dailyDemand / piecesPerDay : 0;

  // Classificação da tolerância
  let fatigueCategory: 'leve' | 'moderada' | 'pesada' = 'leve';
  if (fatigueTolerancePercent > 18) {
    fatigueCategory = 'pesada';
  } else if (fatigueTolerancePercent >= 11) {
    fatigueCategory = 'moderada';
  }

  return {
    normalTime: Math.round(normalTime * 10000) / 10000,
    standardTime: Math.round(standardTime * 10000) / 10000,
    piecesPerHour: Math.round(piecesPerHour * 10) / 10,
    piecesPerDay: Math.round(piecesPerDay * 10) / 10,
    requiredWorkstations: Math.round(requiredWorkstations * 100) / 100,
    fatigueCategory,
  };
}

/**
 * Calcula os KPIs de Balanceamento de Linha para o Modelo
 */
export function calculateLineBalanceKPIs(model: ProductModel): LineBalanceKPIs {
  const operations = model.operations;
  if (!operations || operations.length === 0) {
    return {
      totalCycleTimeMinutes: 0,
      bottleneckOperation: null,
      maxCycleTime: 0,
      lineCapacityPerHour: 0,
      lineCapacityPerDay: 0,
      totalWorkstations: 0,
      balanceEfficiencyPercent: 0,
      averagePace: 100,
      averageFatigue: 12,
    };
  }

  let totalCycleTimeMinutes = 0;
  let maxCycleTime = 0;
  let bottleneckOp: Operation | null = null;
  let totalWorkstations = 0;
  let sumPace = 0;
  let sumFatigue = 0;

  operations.forEach((op) => {
    totalCycleTimeMinutes += op.standardTime;
    totalWorkstations += op.requiredWorkstations;
    sumPace += op.workPace;
    sumFatigue += op.fatigueTolerancePercent;

    if (op.standardTime > maxCycleTime) {
      maxCycleTime = op.standardTime;
      bottleneckOp = op;
    }
  });

  const minutesPerShift = (model.workShiftHours || 8.8) * 60;
  // A capacidade da linha depende da operação gargalo (se postos = 1 para cada) ou pelo tempo de ciclo do gargalo
  const lineCapacityPerHour = maxCycleTime > 0 ? Math.round((60 / maxCycleTime) * 10) / 10 : 0;
  const lineCapacityPerDay = maxCycleTime > 0 ? Math.round((minutesPerShift / maxCycleTime) * 10) / 10 : 0;

  // Eficiência de balanceamento: (Soma dos tempos / (Nº de operações * Tempo do gargalo)) * 100
  let balanceEfficiencyPercent = 0;
  if (operations.length > 0 && maxCycleTime > 0) {
    balanceEfficiencyPercent = Math.round(
      (totalCycleTimeMinutes / (operations.length * maxCycleTime)) * 1000
    ) / 10;
  }

  return {
    totalCycleTimeMinutes: Math.round(totalCycleTimeMinutes * 1000) / 1000,
    bottleneckOperation: bottleneckOp,
    maxCycleTime: Math.round(maxCycleTime * 1000) / 1000,
    lineCapacityPerHour,
    lineCapacityPerDay,
    totalWorkstations: Math.round(totalWorkstations * 100) / 100,
    balanceEfficiencyPercent,
    averagePace: Math.round(sumPace / operations.length),
    averageFatigue: Math.round((sumFatigue / operations.length) * 10) / 10,
  };
}

/**
 * Gera sugestões inteligentes de otimização industrial (Engenharia de Métodos / Lean Manufacturing)
 */
export function generateOptimizationSuggestions(model: ProductModel): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  const operations = model.operations;

  if (!operations || operations.length === 0) {
    return suggestions;
  }

  const avgStandardTime =
    operations.reduce((acc, op) => acc + op.standardTime, 0) / operations.length;

  operations.forEach((op) => {
    // 1. Gargalos de produção: postos de trabalho necessários > 2
    if (op.requiredWorkstations > 2.0) {
      suggestions.push({
        id: `bottleneck-${op.id}`,
        type: 'bottleneck',
        severity: 'critical',
        operationName: op.name,
        operationCode: op.code,
        title: `Gargalo Crítico Identificado (${op.requiredWorkstations.toFixed(1)} postos)`,
        description: `Esta operação requer ${op.requiredWorkstations.toFixed(1)} postos paralelos para atender a demanda diária de ${model.dailyDemand} peças, restringindo o fluxo contínuo.`,
        recommendation: `Dividir a tarefa em duas etapas sequenciais, instalar gabarito de fixação rápida (SMED) ou balancear alocando ${Math.ceil(op.requiredWorkstations)} operadores em células de trabalho paralelas.`,
        impact: `Desafoga o fluxo produtivo e eleva a vazão diária em até ${Math.round((op.requiredWorkstations - 1) * 35)}%.`,
      });
    }

    // 2. Operações muito longas comparadas a outras similares (Outliers)
    if (operations.length > 2 && op.standardTime > avgStandardTime * 1.6) {
      suggestions.push({
        id: `outlier-${op.id}`,
        type: 'outlier_time',
        severity: 'warning',
        operationName: op.name,
        operationCode: op.code,
        title: `Tempo de Ciclo Elevado (+${Math.round(((op.standardTime - avgStandardTime) / avgStandardTime) * 100)}% acima da média)`,
        description: `O tempo padrão de ${op.standardTime.toFixed(2)} min está expressivamente superior à média do modelo (${avgStandardTime.toFixed(2)} min).`,
        recommendation: `Conduzir cronoanálise fracionada por micromovimentos (Therbligs), eliminar esperas/transportes e verificar se atividades secundárias podem ser feitas externamente (trabalho externo).`,
        impact: `Redução potencial de 15% a 30% no tempo padrão através de simplificação de métodos.`,
      });
    }

    // 3. Fadiga excessiva / Ergonômica (> 18%)
    if (op.fatigueTolerancePercent > 18) {
      suggestions.push({
        id: `fatigue-${op.id}`,
        type: 'fatigue_alert',
        severity: 'warning',
        operationName: op.name,
        operationCode: op.code,
        title: `Sobrecarga Ergonômica / Tolerância de Fadiga Crítica (${op.fatigueTolerancePercent}%)`,
        description: `A tolerância calculada via Westinghouse atingiu ${op.fatigueTolerancePercent}%, classificada como pesada. Isso desgasta o operador e eleva o absenteísmo.`,
        recommendation: `Aplicar adequação ergonômica (NR-17): bancada com regulagem de altura, tapete antifadiga, balanceadores pneumáticos para suporte de peso e rodízio programado de operadores.`,
        impact: `Permite reduzir a tolerância de fadiga para ~10-12%, economizando tempo padrão e evitando lesões LER/DORT.`,
      });
    }

    // 4. Oportunidade de Automação (Operação Manual com alto volume e postos > 1.4)
    if (op.type === 'manual' && op.requiredWorkstations >= 1.5 && op.standardTime > 1.0) {
      suggestions.push({
        id: `auto-${op.id}`,
        type: 'automation_opportunity',
        severity: 'info',
        operationName: op.name,
        operationCode: op.code,
        title: `Candidata para Automação / Mecanização`,
        description: `Operação manual com tempo representativo (${op.standardTime.toFixed(2)} min) e demanda de ${op.requiredWorkstations.toFixed(1)} postos.`,
        recommendation: `Avaliar alimentador automático, parafusadeira com controle de torque pneumática ou dispositivo Poka-Yoke semiautomático.`,
        impact: `Aumento de repetibilidade, redução de desvio padrão do tempo e liberação de mão-de-obra para tarefas de valor agregado.`,
      });
    }

    // 5. Ritmo de Trabalho Descompassado
    if (op.workPace > 120) {
      suggestions.push({
        id: `pace-high-${op.id}`,
        type: 'pace_imbalance',
        severity: 'warning',
        operationName: op.name,
        operationCode: op.code,
        title: `Ritmo de Cronometragem Muito Elevado (${op.workPace}%)`,
        description: `O fator de ritmo avaliado durante a tomada foi de ${op.workPace}%. O operador estava em aceleração temporária não sustentável durante todo o turno de 8,8h.`,
        recommendation: `Revisar a tomada de tempos com 3 a 5 novas amostras em diferentes horários do turno para evitar subdimensionar o tempo padrão.`,
        impact: `Evita metas de produção irrealistas que causam desmotivação e não conformidades na qualidade.`,
      });
    } else if (op.workPace < 85) {
      suggestions.push({
        id: `pace-low-${op.id}`,
        type: 'pace_imbalance',
        severity: 'info',
        operationName: op.name,
        operationCode: op.code,
        title: `Ritmo de Operação Abaixo do Normal (${op.workPace}%)`,
        description: `O ritmo medido foi de ${op.workPace}%. Pode indicar falta de treinamento, ferramenta inadequada ou hesitação na sequência de montagem.`,
        recommendation: `Realizar treinamento operacional padrão (PO - Procedimento Operacional) e padronização visual no posto de trabalho.`,
        impact: `Aproxima o operador do ritmo padrão industrial (100%).`,
      });
    }
  });

  return suggestions;
}
