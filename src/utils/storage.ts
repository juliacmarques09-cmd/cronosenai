import { ProductModel } from '../types/industrial';
import { calculateOperationMetrics } from './calculations';
import { DEFAULT_WESTINGHOUSE_RATING, WESTINGHOUSE_PRESETS } from './westinghouse';

const STORAGE_KEY = 'cronoind_industrial_models_v2';
const ACTIVE_MODEL_KEY = 'cronoind_active_model_id_v2';

export const INITIAL_MODELS: ProductModel[] = [
  {
    id: 'model-valvula-vh450',
    code: 'MOD-VH450',
    name: 'Válvula Reguladora Hidráulica VH-450',
    description: 'Corpo em aço nodular usinado, carretel de precisão com vedação em NBR para linhas hidráulicas de alta pressão (350 bar).',
    dailyDemand: 350,
    workShiftHours: 8.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    operations: [
      {
        id: 'op-010',
        modelId: 'model-valvula-vh450',
        code: 'OP-010',
        name: 'Corte e Desbaste do Tarugo de Aço',
        description: 'Serra de fita automática e pré-usinagem do tarugo para dimensão de referência.',
        type: 'machine',
        machineName: 'Serra Fita CNC BandSaw-300',
        measuredTimeSexagesimal: '01:12',
        measuredTimeCentesimal: 1.20,
        workPace: 100,
        fatigueTolerancePercent: 12,
        westinghouseRating: WESTINGHOUSE_PRESETS[1].rating,
        fatigueCategory: 'moderada',
        ...calculateOperationMetrics(1.20, 100, 12, 350, 8.8),
        measurements: [
          {
            id: 'm-1',
            operationId: 'op-010',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            sexagesimalInput: '01:12',
            minutes: 1,
            seconds: 12,
            totalSeconds: 72,
            centesimalMinutes: 1.20,
            centesimalSeconds: 120,
            operatorName: 'Carlos Silveira',
            notes: 'Ciclo estável sem vibrações'
          },
          {
            id: 'm-2',
            operationId: 'op-010',
            timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
            sexagesimalInput: '01:14',
            minutes: 1,
            seconds: 14,
            totalSeconds: 74,
            centesimalMinutes: 1.23,
            centesimalSeconds: 123,
            operatorName: 'Carlos Silveira',
            notes: 'Troca rápida de barra'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'op-020',
        modelId: 'model-valvula-vh450',
        code: 'OP-020',
        name: 'Torneamento e Furação dos Canais Internos',
        description: 'Ciclo de usinagem nos canais de passagem de óleo com tolerância micrométrica H7.',
        type: 'machine',
        machineName: 'Centro de Torneamento CNC Haas ST-20',
        measuredTimeSexagesimal: '02:45',
        measuredTimeCentesimal: 2.75,
        workPace: 95,
        fatigueTolerancePercent: 14,
        westinghouseRating: WESTINGHOUSE_PRESETS[1].rating,
        fatigueCategory: 'moderada',
        ...calculateOperationMetrics(2.75, 95, 14, 350, 8.8),
        measurements: [
          {
            id: 'm-3',
            operationId: 'op-020',
            timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
            sexagesimalInput: '02:45',
            minutes: 2,
            seconds: 45,
            totalSeconds: 165,
            centesimalMinutes: 2.75,
            centesimalSeconds: 275,
            operatorName: 'Marcos Rezende',
            notes: 'Usinagem interna profunda - operação gargalo'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'op-030',
        modelId: 'model-valvula-vh450',
        code: 'OP-030',
        name: 'Rebarbação Manual e Limpeza Ultrassônica',
        description: 'Remoção de rebarbas com raspador de precisão e banho desengraxante em cuba ultrassônica.',
        type: 'manual',
        measuredTimeSexagesimal: '00:48',
        measuredTimeCentesimal: 0.80,
        workPace: 110,
        fatigueTolerancePercent: 10,
        westinghouseRating: WESTINGHOUSE_PRESETS[0].rating,
        fatigueCategory: 'leve',
        ...calculateOperationMetrics(0.80, 110, 10, 350, 8.8),
        measurements: [
          {
            id: 'm-4',
            operationId: 'op-030',
            timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
            sexagesimalInput: '00:48',
            minutes: 0,
            seconds: 48,
            totalSeconds: 48,
            centesimalMinutes: 0.80,
            centesimalSeconds: 80,
            operatorName: 'Luciana Ramos',
            notes: 'Operação rápida e ergonômica'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'op-040',
        modelId: 'model-valvula-vh450',
        code: 'OP-040',
        name: 'Montagem do Carretel, Molas e O-Rings',
        description: 'Inserção cuidadosa dos componentes internos, lubrificação com graxa de montagem e calibração de mola.',
        type: 'manual',
        measuredTimeSexagesimal: '01:54',
        measuredTimeCentesimal: 1.90,
        workPace: 105,
        fatigueTolerancePercent: 13,
        westinghouseRating: WESTINGHOUSE_PRESETS[2].rating,
        fatigueCategory: 'moderada',
        ...calculateOperationMetrics(1.90, 105, 13, 350, 8.8),
        measurements: [
          {
            id: 'm-5',
            operationId: 'op-040',
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
            sexagesimalInput: '01:54',
            minutes: 1,
            seconds: 54,
            totalSeconds: 114,
            centesimalMinutes: 1.90,
            centesimalSeconds: 190,
            operatorName: 'Fernanda Oliveira',
            notes: 'Montagem com dispositivo de compressão'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'op-050',
        modelId: 'model-valvula-vh450',
        code: 'OP-050',
        name: 'Teste Hidrostático de Pressão e Vazamento',
        description: 'Ensaio a 420 bar durante 45 segundos para verificar estanqueidade e abertura da válvula.',
        type: 'machine',
        machineName: 'Bancada Testes Hidráulicos BH-500',
        measuredTimeSexagesimal: '01:30',
        measuredTimeCentesimal: 1.50,
        workPace: 100,
        fatigueTolerancePercent: 9,
        westinghouseRating: WESTINGHOUSE_PRESETS[4].rating,
        fatigueCategory: 'leve',
        ...calculateOperationMetrics(1.50, 100, 9, 350, 8.8),
        measurements: [
          {
            id: 'm-6',
            operationId: 'op-050',
            timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
            sexagesimalInput: '01:30',
            minutes: 1,
            seconds: 30,
            totalSeconds: 90,
            centesimalMinutes: 1.50,
            centesimalSeconds: 150,
            operatorName: 'Rafael Gomes',
            notes: 'Pressurização automatizada'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'op-060',
        modelId: 'model-valvula-vh450',
        code: 'OP-060',
        name: 'Gravação Laser, Etiquetagem e Embalagem',
        description: 'Gravação do número de série e lote a laser, colocação de tampões protetores e caixa plástica.',
        type: 'mixed',
        machineName: 'Gravadora Laser FiberMark 30W',
        measuredTimeSexagesimal: '00:36',
        measuredTimeCentesimal: 0.60,
        workPace: 100,
        fatigueTolerancePercent: 8,
        westinghouseRating: WESTINGHOUSE_PRESETS[0].rating,
        fatigueCategory: 'leve',
        ...calculateOperationMetrics(0.60, 100, 8, 350, 8.8),
        measurements: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'model-chassi-alpha',
    code: 'MOD-CH60',
    name: 'Chassi Tubular Metálico Alpha-60',
    description: 'Estrutura em tubos de aço SAE 1020 soldados por processo MIG/MAG para veículos utilitários leves.',
    dailyDemand: 120,
    workShiftHours: 8.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    operations: [
      {
        id: 'op-c1',
        modelId: 'model-chassi-alpha',
        code: 'OP-010',
        name: 'Corte e Chanfro dos Tubos',
        description: 'Corte com serra de fita angular e esmerilhamento para chanfro em V.',
        type: 'machine',
        machineName: 'Serra Angular Tridimensional',
        measuredTimeSexagesimal: '01:45',
        measuredTimeCentesimal: 1.75,
        workPace: 100,
        fatigueTolerancePercent: 12,
        westinghouseRating: WESTINGHOUSE_PRESETS[1].rating,
        fatigueCategory: 'moderada',
        ...calculateOperationMetrics(1.75, 100, 12, 120, 8.8),
        measurements: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'op-c2',
        modelId: 'model-chassi-alpha',
        code: 'OP-020',
        name: 'Soldagem MIG Estrutural no Gabarito',
        description: 'Montagem e soldagem completa dos nós estruturais em gabarito giratório.',
        type: 'manual',
        measuredTimeSexagesimal: '04:30',
        measuredTimeCentesimal: 4.50,
        workPace: 90,
        fatigueTolerancePercent: 20,
        westinghouseRating: WESTINGHOUSE_PRESETS[3].rating,
        fatigueCategory: 'pesada',
        ...calculateOperationMetrics(4.50, 90, 20, 120, 8.8),
        measurements: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'op-c3',
        modelId: 'model-chassi-alpha',
        code: 'OP-030',
        name: 'Inspeção Dimensional e Pintura Eletrostática',
        description: 'Checagem com calibrador óptico e aplicação de pintura a pó poliéster.',
        type: 'mixed',
        machineName: 'Cabine de Pintura Contínua',
        measuredTimeSexagesimal: '02:00',
        measuredTimeCentesimal: 2.00,
        workPace: 100,
        fatigueTolerancePercent: 11,
        westinghouseRating: WESTINGHOUSE_PRESETS[0].rating,
        fatigueCategory: 'moderada',
        ...calculateOperationMetrics(2.00, 100, 11, 120, 8.8),
        measurements: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]
  }
];

export function getStoredModels(): ProductModel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredModels(INITIAL_MODELS);
      return INITIAL_MODELS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveStoredModels(INITIAL_MODELS);
    return INITIAL_MODELS;
  } catch (err) {
    console.error('Error loading stored models:', err);
    return INITIAL_MODELS;
  }
}

export function saveStoredModels(models: ProductModel[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
  } catch (err) {
    console.error('Error saving models to localStorage:', err);
  }
}

export function getStoredActiveModelId(models: ProductModel[]): string {
  try {
    const active = localStorage.getItem(ACTIVE_MODEL_KEY);
    if (active && models.some((m) => m.id === active)) {
      return active;
    }
    return models[0]?.id || '';
  } catch {
    return models[0]?.id || '';
  }
}

export function saveStoredActiveModelId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_MODEL_KEY, id);
  } catch (err) {
    console.error('Error saving active model id:', err);
  }
}

/**
 * Cria backup em JSON estruturado para salvar no Google Drive ou download
 */
export function exportDatabaseBackup(models: ProductModel[]): string {
  const exportPayload = {
    appName: 'CronoInd - Sistema de Cronoanálise Industrial',
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    standards: {
      defaultShiftHours: 8.8,
      toleranceMethod: 'Westinghouse + Ergonomics (NR-17)',
      unitSystems: ['Sexagesimal (MM:SS)', 'Centesimal (DM/CM - 100)']
    },
    totalModels: models.length,
    models,
  };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Restaura dados de um arquivo de backup
 */
export function restoreDatabaseBackup(jsonString: string): ProductModel[] | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.models && Array.isArray(parsed.models)) {
      saveStoredModels(parsed.models);
      return parsed.models;
    }
    if (Array.isArray(parsed)) {
      saveStoredModels(parsed);
      return parsed;
    }
    return null;
  } catch (err) {
    console.error('Failed to parse backup JSON:', err);
    return null;
  }
}
