/**
 * Utilitários de conversão rigorosa entre Tempo Sexagesimal e Tempo Centesimal
 * Padrão da Engenharia de Métodos e Cronoanálise Industrial.
 *
 * Sistema Sexagesimal:
 * 1 minuto = 60 segundos
 * Notação: MM:SS ou MM:SS.cc
 *
 * Sistema Centesimal:
 * 1 minuto = 100 centiminutos (CM / DM - Deciminuto ou Centiminuto)
 * Exemplo:
 * - 00:30 sexagesimal = 0.50 min centesimal (50 centiminutos)
 * - 01:15 sexagesimal = 1.25 min centesimal (125 centiminutos)
 * - 01:30 sexagesimal = 1.50 min centesimal (150 centiminutos)
 * - 02:45 sexagesimal = 2.75 min centesimal (275 centiminutos)
 */

export interface TimeConversionResult {
  valid: boolean;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  centesimalMinutes: number; // ex: 1.50
  centesimalHundredths: number; // ex: 150 CM (centiminutos)
  sexagesimalFormatted: string; // "01:30"
  centesimalFormatted: string; // "1.50 min (150 CM)"
  explanation: string;
}

/**
 * Converte string sexagesimal (MM:SS ou MM:SS.cc ou segundos) para centesimal
 */
export function sexagesimalToCentesimal(input: string): TimeConversionResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      valid: false,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      centesimalMinutes: 0,
      centesimalHundredths: 0,
      sexagesimalFormatted: '00:00',
      centesimalFormatted: '0.00 min',
      explanation: 'Insira um valor no formato MM:SS ou segundos.',
    };
  }

  let totalSec = 0;
  let min = 0;
  let sec = 0;

  if (trimmed.includes(':')) {
    const parts = trimmed.split(':');
    min = parseFloat(parts[0]) || 0;
    sec = parseFloat(parts[1]) || 0;
    totalSec = min * 60 + sec;
  } else {
    // Se for apenas número
    const num = parseFloat(trimmed);
    if (isNaN(num)) {
      return {
        valid: false,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        centesimalMinutes: 0,
        centesimalHundredths: 0,
        sexagesimalFormatted: '00:00',
        centesimalFormatted: '0.00 min',
        explanation: 'Formato inválido. Use MM:SS (ex: 01:30) ou segundos.',
      };
    }
    // Se digitou algo como 90 segundos
    totalSec = num;
    min = Math.floor(totalSec / 60);
    sec = Math.round((totalSec % 60) * 100) / 100;
  }

  // Centesimal: minutos totais = segundos / 60
  const centesimalMin = totalSec / 60;
  const centesimalHundredths = centesimalMin * 100;

  const minStr = String(min).padStart(2, '0');
  const secInt = Math.floor(sec);
  const secFrac = Math.round((sec - secInt) * 100);
  const secStr = String(secInt).padStart(2, '0') + (secFrac > 0 ? `.${secFrac}` : '');

  const sexFormatted = `${minStr}:${secStr}`;
  const centFormatted = `${centesimalMin.toFixed(2)} min (${centesimalHundredths.toFixed(0)} CM)`;

  return {
    valid: true,
    minutes: min,
    seconds: sec,
    totalSeconds: Math.round(totalSec * 1000) / 1000,
    centesimalMinutes: Math.round(centesimalMin * 10000) / 10000,
    centesimalHundredths: Math.round(centesimalHundredths * 100) / 100,
    sexagesimalFormatted: sexFormatted,
    centesimalFormatted: centFormatted,
    explanation: `${totalSec.toFixed(1)}s ÷ 60 = ${centesimalMin.toFixed(4)} min centesimais`,
  };
}

/**
 * Converte minutos centesimais (ex: 1.50) para formato sexagesimal (01:30)
 */
export function centesimalToSexagesimal(centesimalMinutes: number): TimeConversionResult {
  if (isNaN(centesimalMinutes) || centesimalMinutes < 0) {
    return {
      valid: false,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      centesimalMinutes: 0,
      centesimalHundredths: 0,
      sexagesimalFormatted: '00:00',
      centesimalFormatted: '0.00 min',
      explanation: 'Valor centesimal inválido.',
    };
  }

  const totalSeconds = centesimalMinutes * 60;
  const minutes = Math.floor(totalSeconds / 60);
  const remainderSeconds = totalSeconds % 60;
  const secondsInt = Math.floor(remainderSeconds);
  const hundredthsOfSecond = Math.round((remainderSeconds - secondsInt) * 100);

  const minStr = String(minutes).padStart(2, '0');
  const secStr = String(secondsInt).padStart(2, '0') + (hundredthsOfSecond > 0 ? `.${hundredthsOfSecond}` : '');
  const sexFormatted = `${minStr}:${secStr}`;

  return {
    valid: true,
    minutes,
    seconds: remainderSeconds,
    totalSeconds: Math.round(totalSeconds * 100) / 100,
    centesimalMinutes,
    centesimalHundredths: Math.round(centesimalMinutes * 100 * 100) / 100,
    sexagesimalFormatted: sexFormatted,
    centesimalFormatted: `${centesimalMinutes.toFixed(2)} min`,
    explanation: `${centesimalMinutes.toFixed(2)} min × 60 = ${totalSeconds.toFixed(1)}s (${sexFormatted})`,
  };
}

/**
 * Formata milissegundos para MM:SS.cc para cronômetro
 */
export function formatMillisecondsToSexagesimal(ms: number): string {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const hundredths = Math.floor((ms % 1000) / 10);

  const minStr = String(minutes).padStart(2, '0');
  const secStr = String(seconds).padStart(2, '0');
  const hundredthsStr = String(hundredths).padStart(2, '0');

  return `${minStr}:${secStr}.${hundredthsStr}`;
}
