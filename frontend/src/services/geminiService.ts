import { GoogleGenAI, Type } from "@google/genai";
import { AI_SYSTEM_INSTRUCTION } from "../constants";
import { formatCurrency } from "./gameLogic";

const getAiClient = () => {
  // Use Vite environment variable
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("Gemini API Key is missing (VITE_GEMINI_API_KEY). Using fallback mode.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Types for the responses
export interface AiIncentive {
  title: string;
  practicalTip: string;
  bingoImpact: string;
  timeImpact: string;
}

export interface AiChallenge {
  title: string;
  description: string;
  victoryCriteria: string;
  financialOption: string; // "Sortear 1 número"
  taskOption: string;      // "Fazer massagem"
}

export interface AiPrediction {
  likelyFinishDate: string;
  paceAnalysis: string;
  optimisticScenario: string;
  pessimisticScenario: string;
  recommendation: string;
  investmentRoiEstimate?: string; // New field for ROI
  timeReductionWithInvestment?: string; // New field for time reduction
}

// Lista de Fallbacks variados para quando a API falhar ou demorar
// REORGANIZADO: Opções sem 'massagem' no topo para garantir variedade imediata
const FALLBACK_CHALLENGES: AiChallenge[] = [
  {
    title: "Dançarino Improvável",
    description: "Coloquem uma música brega. Quem dançar com mais 'alma' (ou menos vergonha) vence.",
    victoryCriteria: "Julgamento subjetivo (regra de ouro: sem briga).",
    financialOption: "Sortear 1 número extra",
    taskOption: "Preparar um drink (ou suco especial) para o vencedor agora"
  },
  {
    title: "Pedra, Papel e Tesoura",
    description: "Melhor de 5 rodadas. O clássico nunca falha.",
    victoryCriteria: "Quem vencer 3 vezes ganha.",
    financialOption: "Sortear 1 número extra",
    taskOption: "Lavar toda a louça do jantar de hoje"
  },
  {
    title: "Desafio da Prancha",
    description: "Quem aguentar menos tempo na posição de prancha paga a prenda!",
    victoryCriteria: "Maior tempo vence.",
    financialOption: "Sortear 1 número extra",
    taskOption: "Fazer uma massagem de 10 minutos no vencedor"
  },
  {
    title: "O Mestre Mandou",
    description: "Um jogador dá ordens rápidas, o outro obedece. Quem errar ou demorar perde.",
    victoryCriteria: "Atenção e reflexo.",
    financialOption: "Sortear 1 número extra",
    taskOption: "Fazer 15 minutos de cafuné no vencedor"
  },
  {
    title: "Cara ou Coroa",
    description: "Joguem a moeda. Cara vence, Coroa perde.",
    victoryCriteria: "Sorte pura.",
    financialOption: "Sortear 1 número extra",
    taskOption: "Limpar o banheiro essa semana (completo!)"
  },
  {
    title: "Quiz do Casal",
    description: "Façam 3 perguntas sobre a história de vocês. Quem acertar mais vence.",
    victoryCriteria: "Memória afetiva.",
    financialOption: "Sortear 1 número extra",
    taskOption: "Postar uma declaração de amor brega nos Stories"
  },
  {
    title: "Jogo do Sério",
    description: "Olhem fixamente nos olhos um do outro. Quem rir primeiro perde.",
    victoryCriteria: "Auto-controle.",
    financialOption: "Sortear 1 número extra",
    taskOption: "Ser o motorista da rodada/Uber no próximo passeio"
  },
  {
    title: "Arremesso de Meia",
    description: "Faça uma bola de meia. Tente acertar o cesto de roupa suja de longe. 5 tentativas.",
    victoryCriteria: "Mais acertos vence.",
    financialOption: "Sortear 1 número extra",
    taskOption: "Preparar o café da manhã na cama amanhã"
  }
];

// Categorias forçadas para garantir que a IA não fique preguiçosa
const TASK_CATEGORIES = [
  "MICO / ENGRAÇADO (Ex: Dançar, imitar, cantar)",
  "TAREFA DOMÉSTICA CHATA (Ex: Lixo, Louça, Vidros)",
  "GESTO ROMÂNTICO (Ex: Carta, Elogios, Declaração)",
  "SERVIÇO PESSOAL (Ex: Drink, Café na cama, Motorista)",
  "LÚDICO (Ex: Desenhar o outro, Contar piada)"
];

export const getIncentive = async (
  p1Name: string,
  p2Name: string,
  contextData: {
    totalGoal: number,
    deadlineMonths: number,
    totalNumbers: number,
    avgValue: number,
    progressPercent: number,
    remainingNumbers: number,
    objective: string
  }
): Promise<AiIncentive> => {
  const ai = getAiClient();

  const fallback: AiIncentive = {
    title: "Economia do Cafezinho",
    practicalTip: "Cortar gastos supérfluos diários.",
    bingoImpact: "Pode eliminar 2 números pequenos por semana.",
    timeImpact: "Antecipa a meta em alguns dias."
  };

  if (!ai) return fallback;

  // Interpolate data into prompt
  const contextPrompt = `
    DADOS DE CONTEXTO:
    - Valor total da meta: ${formatCurrency(contextData.totalGoal)}
    - Prazo da meta: ${contextData.deadlineMonths} meses
    - Total de números do bingo: ${contextData.totalNumbers}
    - Valor médio por número: ${formatCurrency(contextData.avgValue)}
    - Percentual já alcançado: ${contextData.progressPercent.toFixed(1)}%
    - Números restantes: ${contextData.remainingNumbers}
    - Objetivo do casal: ${contextData.objective}
    
    Gere um INCENTIVO FINANCEIRO seguindo as regras do sistema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contextPrompt,
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        temperature: 0.8, // Slightly creative for tips
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título curto da dica" },
            practicalTip: { type: Type.STRING, description: "A dica prática quantificada" },
            bingoImpact: { type: Type.STRING, description: "Impacto em números do bingo" },
            timeImpact: { type: Type.STRING, description: "Impacto no tempo da meta" }
          },
          required: ["title", "practicalTip", "bingoImpact", "timeImpact"]
        }
      }
    });

    const text = response.text;
    if (!text) return fallback;
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Gemini Error:", error);
    return fallback;
  }
};

export const getChallenge = async (
  p1Name: string,
  p2Name: string
): Promise<AiChallenge> => {
  const ai = getAiClient();

  // Pick a random fallback to ensure variety even when API fails
  const fallback = FALLBACK_CHALLENGES[Math.floor(Math.random() * FALLBACK_CHALLENGES.length)];

  if (!ai) return fallback;

  // Sorteia uma categoria obrigatória para este request
  const requiredCategory = TASK_CATEGORIES[Math.floor(Math.random() * TASK_CATEGORIES.length)];

  const prompt = `
    Selecione um DESAFIO da Lista Oficial (varie entre Habilidade, Sorte, Memória, Doméstico, Criativo).
    Jogadores: ${p1Name} e ${p2Name}.
    NÃO crie desafios de discussão ou subjetivos.
    
    IMPORTANTE - DEFINIÇÃO DA PRENDA (taskOption):
    Para este desafio, você OBRIGATORIAMENTE deve gerar uma prenda da categoria:
    >>> ${requiredCategory} <<<
    
    Seja criativo nesta categoria. NÃO repita "Massagem" se a categoria não for relaxamento.
    
    Gere DUAS opções de consequência:
    1. 'financialOption': Sempre envolver sorteio de números no Bingo (ex: "Sortear 1 número").
    2. 'taskOption': A prenda da categoria sorteada acima.
    
    Responda apenas com o JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        temperature: 1.2, // High temperature for maximum creativity
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título do desafio" },
            description: { type: Type.STRING, description: "Descrição objetiva e rápida" },
            victoryCriteria: { type: Type.STRING, description: "Critério claro de vitória" },
            financialOption: { type: Type.STRING, description: "Opção 1: Consequência financeira (sorteio)" },
            taskOption: { type: Type.STRING, description: "Opção 2: Consequência de tarefa/afeto/diversão" }
          },
          required: ["title", "description", "victoryCriteria", "financialOption", "taskOption"],
        },
      }
    });

    const text = response.text;
    if (!text) return fallback;
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Challenge Error:", error);
    return fallback;
  }
};

export const getPrediction = async (
  p1Name: string,
  p2Name: string,
  historyData: any[],
  goalData: { totalGoal: number, currentSaved: number, monthsElapsed: number }
): Promise<AiPrediction> => {
  const ai = getAiClient();

  const fallback: AiPrediction = {
    likelyFinishDate: "Cálculo em processamento...",
    paceAnalysis: "Seu ritmo é constante, mas precisamos de mais dados PRO para precisão.",
    optimisticScenario: "Se mantiverem o foco, podem terminar 2 meses antes.",
    pessimisticScenario: "Evitem pausas longas para não atrasar o sonho.",
    recommendation: "Mantenham o Ritual do Bingo em dia!",
    investmentRoiEstimate: "R$ 0,00",
    timeReductionWithInvestment: "Calculando..."
  };

  if (!ai) return fallback;

  const prompt = `
    ANÁLISE DE RITMO (PRO):
    - Casal: ${p1Name} e ${p2Name}
    - Meta Total: ${formatCurrency(goalData.totalGoal)}
    - Total Acumulado: ${formatCurrency(goalData.currentSaved)}
    - Meses Decorridos: ${goalData.monthsElapsed}
    - Histórico de Sorteios: ${JSON.stringify(historyData.slice(0, 10))}
    
    TAREFA: Gere uma PREDIÇÃO FINANCEIRA considerando:
    1. O ritmo atual de sorteios.
    2. Otimização de Rentabilidade: Calcule quanto o dinheiro renderia se investido em CDI (100% Selic aprox 1% ao mês) em vez de guardado parado.
    3. Estimativa de tempo reduzido: Quantos meses seriam antecipados com esses rendimentos.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        temperature: 0.5, // Lower temperature for analytical results
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            likelyFinishDate: { type: Type.STRING },
            paceAnalysis: { type: Type.STRING },
            optimisticScenario: { type: Type.STRING },
            pessimisticScenario: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            investmentRoiEstimate: { type: Type.STRING, description: "Valor estimado de rendimentos em investimentos conservadores" },
            timeReductionWithInvestment: { type: Type.STRING, description: "Tempo antecipado se o dinheiro for investido" }
          },
          required: ["likelyFinishDate", "paceAnalysis", "optimisticScenario", "pessimisticScenario", "recommendation", "investmentRoiEstimate", "timeReductionWithInvestment"]
        }
      }
    });

    const text = response.text;
    if (!text) return fallback;
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    return fallback;
  }
};