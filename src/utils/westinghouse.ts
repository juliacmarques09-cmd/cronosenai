import { WestinghouseRating } from '../types/industrial';

export interface WestinghouseFactorOption {
  code: string;
  name: string;
  value: number;
  description: string;
}

export const WESTINGHOUSE_SKILL_OPTIONS: WestinghouseFactorOption[] = [
  { code: 'A1', name: 'Super Habilidade (A1)', value: 0.15, description: 'Velocidade e precisão excepcionais, sem erros' },
  { code: 'A2', name: 'Super Habilidade (A2)', value: 0.13, description: 'Altíssima destreza e ritmo contínuo' },
  { code: 'B1', name: 'Excelente (B1)', value: 0.11, description: 'Operador altamente treinado e ágil' },
  { code: 'B2', name: 'Excelente (B2)', value: 0.08, description: 'Excelente coordenação e domínio do processo' },
  { code: 'C1', name: 'Boa (C1)', value: 0.06, description: 'Operador experiente acima da média' },
  { code: 'C2', name: 'Boa (C2)', value: 0.03, description: 'Bom nível de execução e regularidade' },
  { code: 'D', name: 'Média / Normal (D)', value: 0.00, description: 'Padrão esperado para operador qualificado' },
  { code: 'E1', name: 'Regular (E1)', value: -0.05, description: 'Falta de prática ou ritmo irregular' },
  { code: 'E2', name: 'Regular (E2)', value: -0.10, description: 'Dificuldade visível na coordenação' },
  { code: 'F1', name: 'Pobre (F1)', value: -0.16, description: 'Inexperiente, hesita frequentemente' },
  { code: 'F2', name: 'Pobre (F2)', value: -0.22, description: 'Desconhece a sequência correta da operação' },
];

export const WESTINGHOUSE_EFFORT_OPTIONS: WestinghouseFactorOption[] = [
  { code: 'A1', name: 'Excessivo (A1)', value: 0.13, description: 'Ritmo insustentável por longos períodos' },
  { code: 'A2', name: 'Excessivo (A2)', value: 0.12, description: 'Muito acelerado, grande aplicação de energia' },
  { code: 'B1', name: 'Excelente (B1)', value: 0.10, description: 'Ritmo vigoroso com atenção contínua' },
  { code: 'B2', name: 'Excelente (B2)', value: 0.08, description: 'Alto empenho e concentração sistemática' },
  { code: 'C1', name: 'Bom (C1)', value: 0.05, description: 'Ritmo constante acima do normal' },
  { code: 'C2', name: 'Bom (C2)', value: 0.02, description: 'Trabalho contínuo sem pausas desnecessárias' },
  { code: 'D', name: 'Médio / Normal (D)', value: 0.00, description: 'Esforço natural e sustentável ao longo do turno' },
  { code: 'E1', name: 'Regular (E1)', value: -0.04, description: 'Pouco entusiasmo, movimentação vagarosa' },
  { code: 'E2', name: 'Regular (E2)', value: -0.08, description: 'Perda frequente de tempo e distração' },
  { code: 'F1', name: 'Pobre (F1)', value: -0.12, description: 'Desinteresse manifesto ou lentidão acentuada' },
  { code: 'F2', name: 'Pobre (F2)', value: -0.17, description: 'Recusa ao ritmo produtivo normal' },
];

export const WESTINGHOUSE_CONDITIONS_OPTIONS: WestinghouseFactorOption[] = [
  { code: 'A', name: 'Ideal (A)', value: 0.06, description: 'Iluminação, ventilação e ergonomia perfeitas' },
  { code: 'B', name: 'Excelente (B)', value: 0.04, description: 'Ambiente controlado, climatizado e silencioso' },
  { code: 'C', name: 'Boa (C)', value: 0.02, description: 'Ambiente industrial agradável e organizado' },
  { code: 'D', name: 'Média (D)', value: 0.00, description: 'Condições típicas de fábrica / oficina' },
  { code: 'E', name: 'Regular (E)', value: -0.03, description: 'Ruído, calor ou poeira moderados' },
  { code: 'F', name: 'Pobre (F)', value: -0.07, description: 'Ambiente insalubre, pouca luz ou aperto' },
];

export const WESTINGHOUSE_CONSISTENCY_OPTIONS: WestinghouseFactorOption[] = [
  { code: 'A', name: 'Perfeita (A)', value: 0.04, description: 'Tempos de ciclo idênticos a cada repetição' },
  { code: 'B', name: 'Excelente (B)', value: 0.03, description: 'Variação mínima de milésimos entre ciclos' },
  { code: 'C', name: 'Boa (C)', value: 0.01, description: 'Ciclos estáveis com pequenas flutuações normais' },
  { code: 'D', name: 'Média (D)', value: 0.00, description: 'Variações aceitáveis dentro do padrão fabril' },
  { code: 'E', name: 'Regular (E)', value: -0.02, description: 'Variação visível entre ciclos consecutivos' },
  { code: 'F', name: 'Pobre (F)', value: -0.04, description: 'Tempos completamente dispersos e instáveis' },
];

export const DEFAULT_WESTINGHOUSE_RATING: WestinghouseRating = {
  skill: { code: 'D', description: 'Média / Normal', factor: 0.00 },
  effort: { code: 'D', description: 'Médio / Normal', factor: 0.00 },
  conditions: { code: 'D', description: 'Média', factor: 0.00 },
  consistency: { code: 'D', description: 'Média', factor: 0.00 },
  personalNeeds: 5, // 5% padrão OIT / ILO
  fatigueFactor: 5, // 5% fadiga básica
  postureFactor: 2, // 2% postura moderada
  specialFactor: 0,
};

export interface WestinghousePreset {
  id: string;
  name: string;
  category: 'leve' | 'moderada' | 'pesada';
  description: string;
  rating: WestinghouseRating;
}

export const WESTINGHOUSE_PRESETS: WestinghousePreset[] = [
  {
    id: 'bench_light',
    name: 'Bancada Leve / Eletrônica',
    category: 'leve',
    description: 'Trabalho sentado, peças leves (< 0.5 kg), ambiente limpo e climatizado.',
    rating: {
      skill: { code: 'C1', description: 'Boa (C1)', factor: 0.06 },
      effort: { code: 'D', description: 'Médio (D)', factor: 0.00 },
      conditions: { code: 'B', description: 'Excelente (B)', factor: 0.04 },
      consistency: { code: 'C', description: 'Boa (C)', factor: 0.01 },
      personalNeeds: 5,
      fatigueFactor: 3,
      postureFactor: 1,
      specialFactor: 0,
    },
  },
  {
    id: 'machining_cnc',
    name: 'Usinagem CNC / Torno Mecânico',
    category: 'moderada',
    description: 'Operação de máquina, troca de peças médias (1-5 kg), óleo refrigerante e ruído fabril.',
    rating: {
      skill: { code: 'C1', description: 'Boa (C1)', factor: 0.06 },
      effort: { code: 'C2', description: 'Bom (C2)', factor: 0.02 },
      conditions: { code: 'D', description: 'Média (D)', factor: 0.00 },
      consistency: { code: 'C', description: 'Boa (C)', factor: 0.01 },
      personalNeeds: 5,
      fatigueFactor: 6,
      postureFactor: 3,
      specialFactor: 1,
    },
  },
  {
    id: 'manual_assembly',
    name: 'Montagem Manual em Linha',
    category: 'moderada',
    description: 'Postura em pé ou semi-sentado, ritmo sincronizado, ferramentas pneumáticas.',
    rating: {
      skill: { code: 'D', description: 'Média (D)', factor: 0.00 },
      effort: { code: 'C1', description: 'Bom (C1)', factor: 0.05 },
      conditions: { code: 'D', description: 'Média (D)', factor: 0.00 },
      consistency: { code: 'C', description: 'Boa (C)', factor: 0.01 },
      personalNeeds: 5,
      fatigueFactor: 7,
      postureFactor: 3,
      specialFactor: 0,
    },
  },
  {
    id: 'heavy_welding',
    name: 'Soldagem / Caldeiraria Pesada',
    category: 'pesada',
    description: 'Calor elevado, máscara de proteção, postura forçada e manuseio de peças pesadas.',
    rating: {
      skill: { code: 'B2', description: 'Excelente (B2)', factor: 0.08 },
      effort: { code: 'B1', description: 'Excelente (B1)', factor: 0.10 },
      conditions: { code: 'E', description: 'Regular (E)', factor: -0.03 },
      consistency: { code: 'D', description: 'Média (D)', factor: 0.00 },
      personalNeeds: 6,
      fatigueFactor: 12,
      postureFactor: 5,
      specialFactor: 3,
    },
  },
  {
    id: 'inspection_quality',
    name: 'Inspeção e Metrologia',
    category: 'leve',
    description: 'Análise dimensional com paquímetro/micrômetro, alta concentração visual.',
    rating: {
      skill: { code: 'B2', description: 'Excelente (B2)', factor: 0.08 },
      effort: { code: 'D', description: 'Médio (D)', factor: 0.00 },
      conditions: { code: 'B', description: 'Excelente (B)', factor: 0.04 },
      consistency: { code: 'B', description: 'Excelente (B)', factor: 0.03 },
      personalNeeds: 5,
      fatigueFactor: 4,
      postureFactor: 1,
      specialFactor: 0,
    },
  },
];

/**
 * Calcula a soma total de tolerâncias (em percentual %)
 */
export function calculateTotalTolerance(rating: WestinghouseRating): {
  westinghouseFactor: number;
  ergonomicTolerancePercent: number;
  totalTolerancePercent: number;
  category: 'leve' | 'moderada' | 'pesada';
} {
  const westinghouseFactor =
    rating.skill.factor +
    rating.effort.factor +
    rating.conditions.factor +
    rating.consistency.factor;

  const ergonomicTolerancePercent =
    rating.personalNeeds +
    rating.fatigueFactor +
    rating.postureFactor +
    rating.specialFactor;

  // Tolerância total aplicada ao tempo
  const totalTolerancePercent = Math.max(
    5,
    Math.round((ergonomicTolerancePercent + westinghouseFactor * 100) * 10) / 10
  );

  let category: 'leve' | 'moderada' | 'pesada' = 'leve';
  if (totalTolerancePercent > 18) {
    category = 'pesada';
  } else if (totalTolerancePercent >= 11) {
    category = 'moderada';
  }

  return {
    westinghouseFactor: Math.round(westinghouseFactor * 1000) / 1000,
    ergonomicTolerancePercent,
    totalTolerancePercent,
    category,
  };
}
