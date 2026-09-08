import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode2, Download } from 'lucide-react';

interface PromptViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptViewerModal: React.FC<PromptViewerModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const promptText = `PROMPT DE ENGENHARIA DE SOFTWARE FULLSTACK: APLICATIVO INDUSTRIAL DE CRONOMETRAGEM, CONVERSÃO E ANÁLISE DE PRODUÇÃO (CronoInd)

Atue como um Engenheiro de Software Fullstack Sênior e Especialista em Engenharia de Métodos e Processos Industriais (Cronoanálise e Lean Manufacturing).

Seu objetivo é arquitetar e implementar uma solução completa de alta precisão técnica para cronometragem industrial, conversão sexagesimal/centesimal, cálculo de tempos padrão via Sistema Westinghouse, balanceamento de linhas de produção e integração em nuvem (Google Drive API / Vercel).

---
### 1. ARQUITETURA TÉCNICA E STACK
- Frontend: React 18+ (TypeScript), Tailwind CSS para estilização industrial responsiva e limpa, Lucide Icons.
- Backend: Node.js com Express, servindo rotas de API para processamento, sincronização de dados e autenticação Google OAuth 2.0.
- Armazenamento em Nuvem: Google Drive API (armazenamento de arquivos de cronoanálise, backups e planilhas estruturadas) + LocalStorage com versionamento resiliente.
- Deploy: Otimizado para Cloud Run e Vercel com suporte a Serverless Functions (/api/*) e SPA fallback.
- Design: Alto contraste, tipografia técnica com JetBrains Mono para precisão numérica e Plus Jakarta Sans para interface.

---
### 2. REQUISITOS INDUSTRIAIS E FÓRMULAS MATEMÁTICAS EXATAS
1. Conversão Rigorosa de Tempos:
   - Tempo Sexagesimal (MM:SS.cc) para Minutos Centesimais (DM/CM):
     Total Segundos = Minutos * 60 + Segundos
     Minutos Centesimais = Total Segundos / 60
     Centiminutos (CM) = Minutos Centesimais * 100
     (Ex: 01:30 sexagesimal = 90s = 1,50 min centesimais / 150 CM).
   - Conversão Inversa: Minutos Centesimais para MM:SS.

2. Cálculos de Cronoanálise Industrial:
   - Tempo Cronometrado (TC): Média das tomadas de tempo em minutos centesimais.
   - Fator de Ritmo (R): Avaliação do ritmo operacional do trabalhador (slider 50% a 150%, padrão 100%).
   - Tempo Normal (TN): TN = TC * (R / 100).
   - Tolerâncias (FT) via Sistema Westinghouse (4 Fatores: Habilidade, Esforço, Condições, Consistência) + Tolerâncias Ergonômicas de Fadiga e Necessidades Pessoais (NR-17):
     Tolerância Total (%) = Westinghouse + Necessidades Pessoais + Fadiga + Postura
   - Tempo Padrão (TP): TP = TN * (1 + FT% / 100).
   - Produção por Hora: Peças/hora = 60 / TP.
   - Produção Diária Estimada: Peças/dia = (8,8 horas * 60 minutos) / TP = 528 / TP.
   - Postos de Trabalho Necessários: Postos = Demanda Diária / Produção Diária.

---
### 3. MÓDULOS OBRIGATÓRIOS DO APLICATIVO
1. Cadastro de Modelos e Operações:
   - Gerenciamento de múltiplos modelos/produtos com demanda programada.
   - Operações com nome, código, descrição, tipo (manual/máquina) e máquina associada.
   - Botão para imprimir relatório simplificado individual por operação.
2. Cronômetro Digital Integrado:
   - Registro de voltas (laps), cálculo da média dos ciclos e aplicação direta na operação.
3. Tabela Westinghouse Interativa:
   - Sliders e seletores para Habilidade (A1 a F2), Esforço (A1 a F2), Condições (A a F), Consistência (A a F) e Fadiga com templates pré-definidos (Bancada, Usinagem, Soldagem, etc.).
4. Motor de Sugestões de Otimização:
   - Identificação automática do Gargalo da Linha (postos > 2).
   - Identificação de tempos outliers e sobrecarga ergonômica (>18%).
   - Diagnóstico com recomendações acionáveis de Kaizen e balanceamento.
5. Relatórios e Impressão Industrial:
   - Folha de Instrução de Trabalho e Estudo de Tempos pronta para impressão A4 e exportação em PDF.
   - Exportação em planilhas CSV e JSON para Google Drive.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([promptText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Prompt_Engenharia_CronoInd.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Prompt & Especificação de Engenharia</h2>
              <p className="text-xs text-slate-400">
                Blueprint técnico completo para replicação em React, Node/Express e Vercel
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

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Texto pronto para ser usado como especificação ou prompt mestre de IA:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 text-slate-700 hover:text-slate-950 font-semibold px-2 py-1 rounded hover:bg-slate-100"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar .TXT
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-amber-800 font-bold px-3 py-1 bg-amber-100 hover:bg-amber-200 rounded transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado!' : 'Copiar Prompt'}
              </button>
            </div>
          </div>

          <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed whitespace-pre-wrap selection:bg-amber-500 selection:text-slate-950">
            {promptText}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
