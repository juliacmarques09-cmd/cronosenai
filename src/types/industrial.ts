export type OperationType = 'manual' | 'machine' | 'mixed';

export interface TimeMeasurement {
  id: string;
  operationId: string;
  timestamp: string; // ISO string
  sexagesimalInput: string; // "01:30" or "00:45.50"
  minutes: number; // minutes part
  seconds: number; // seconds part
  totalSeconds: number; // total in seconds
  centesimalMinutes: number; // total in centesimal minutes (e.g. 1.50 min)
  centesimalSeconds: number; // centesimal seconds / hundredths
  operatorName?: string;
  notes?: string;
}

export interface WestinghouseRating {
  // Habilidade: +0.15 (A1) to -0.16 (F2), Default 0.00 (D)
  skill: {
    code: string;
    description: string;
    factor: number;
  };
  // Esforço: +0.13 (A1) to -0.17 (F2), Default 0.00 (D)
  effort: {
    code: string;
    description: string;
    factor: number;
  };
  // Condições: +0.06 (A) to -0.07 (F), Default 0.00 (D)
  conditions: {
    code: string;
    description: string;
    factor: number;
  };
  // Consistência: +0.04 (A) to -0.04 (F), Default 0.00 (D)
  consistency: {
    code: string;
    description: string;
    factor: number;
  };
  // Ergonomia e Fadiga
  personalNeeds: number; // % (default 5%)
  fatigueFactor: number; // % (e.g. 4% leve, 8% moderada, 14% pesada)
  postureFactor: number; // % (em pé, curvado, agachado)
  specialFactor: number; // % (ambiente térmico, ruído, etc.)
}

export interface Operation {
  id: string;
  modelId: string;
  code: string; // ex: "OP-010"
  name: string;
  description: string;
  type: OperationType;
  machineName?: string;
  // Tempo Cronometrado Médio (Centesimal em minutos)
  measuredTimeCentesimal: number;
  measuredTimeSexagesimal: string; // "MM:SS"
  // Fator de Ritmo (Desempenho: 80% - 130%)
  workPace: number; // e.g. 100
  // Tolerâncias
  fatigueTolerancePercent: number; // % total de tolerâncias aplicadas (ex: 14%)
  westinghouseRating?: WestinghouseRating;
  fatigueCategory: 'leve' | 'moderada' | 'pesada';
  // Cálculos Automáticos
  normalTime: number; // TN = TC * (Ritmo / 100)
  standardTime: number; // TP = TN * (1 + Tol / 100)
  piecesPerHour: number; // 60 / TP
  piecesPerDay: number; // (8.8 * 60) / TP
  requiredWorkstations: number; // Demanda diária / Peças por dia
  // Histórico de medições desta operação
  measurements: TimeMeasurement[];
  targetTime?: number; // Meta da engenharia
  createdAt: string;
  updatedAt: string;
}

export interface ProductModel {
  id: string;
  code: string;
  name: string;
  description: string;
  dailyDemand: number; // demanda diária desejada (ex: 500 peças/dia)
  workShiftHours: number; // padrão 8.8 horas
  operations: Operation[];
  createdAt: string;
  updatedAt: string;
}

export interface OptimizationSuggestion {
  id: string;
  type: 'bottleneck' | 'fatigue_alert' | 'pace_imbalance' | 'automation_opportunity' | 'outlier_time';
  severity: 'critical' | 'warning' | 'info';
  operationName: string;
  operationCode: string;
  title: string;
  description: string;
  recommendation: string;
  impact: string;
}

export interface LineBalanceKPIs {
  totalCycleTimeMinutes: number; // Soma dos tempos padrões
  bottleneckOperation: Operation | null;
  maxCycleTime: number; // Tempo da operação gargalo
  lineCapacityPerHour: number; // Capacidade da linha (limitada pelo gargalo)
  lineCapacityPerDay: number; // Capacidade diária (8.8h)
  totalWorkstations: number; // Soma de postos necessários
  balanceEfficiencyPercent: number; // Eficiência de balanceamento (%)
  averagePace: number;
  averageFatigue: number;
}
