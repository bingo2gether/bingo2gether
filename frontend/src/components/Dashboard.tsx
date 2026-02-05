import React, { useState, useMemo, useEffect } from 'react';
import { GameState, Transaction, RetentionState } from '../types';
import { formatCurrency, drawWeightedNumber, calculateIncomeRatio, findNumbersForExtraValue, calculateMonthlyTarget, calculateRetentionUpdate, checkInactivity } from '../services/gameLogic';
import { Play, RotateCcw, Sparkles, TrendingUp, Calendar, Printer, Settings2, X, ArrowRight, TrendingDown, Grid, List, Trophy, Gift, Clock, Map as MapIcon, Sun, Moon, Monitor, Car, Briefcase, Gem, Heart, Home, Coins, Flame, CalendarHeart, Lock } from 'lucide-react';
import GeminiCoach from './GeminiCoach';
import GameSummary from './GameSummary';
import { useTheme } from '../ThemeContext';
import { BingoLogo } from './Onboarding';
import PricingModal from './premium/PricingModal';
import PrintView from './PrintView';
import { Crown } from 'lucide-react';
import { SKINS, SkinType } from '../skins';

interface DashboardProps {
  gameState: GameState;
  onUpdateState: (newState: GameState) => void;
  onReset: () => void;
}

const CARD_SIZE = 25; // Standard 5x5 Bingo size

const Dashboard: React.FC<DashboardProps> = ({ gameState, onUpdateState, onReset }) => {
  const { theme, setTheme } = useTheme();

  // Alterado de boolean para guardar o modo inicial
  const [coachMode, setCoachMode] = useState<'incentive' | 'challenge' | null>(null);

  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showBingoModal, setShowBingoModal] = useState(false);
  const [bingoReward, setBingoReward] = useState('Jantar Romântico! 🍝🍷');
  const [tab, setTab] = useState<'dashboard' | 'grid'>('dashboard');
  const [gridView, setGridView] = useState<'list' | 'cards'>('cards');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printType, setPrintType] = useState<'cartelas' | 'tabela' | null>(null);
  const [cartelasPerPage, setCartelasPerPage] = useState<number>(2);

  // Route Modal State
  const [routeTab, setRouteTab] = useState<'income' | 'extra' | 'deadline' | 'skins'>('income');
  const [newP1Income, setNewP1Income] = useState(gameState.players.p1.estimatedIncome.toString());
  const [newP2Income, setNewP2Income] = useState(gameState.players.p2.estimatedIncome.toString());
  const [extraValue, setExtraValue] = useState('');
  const [newDeadline, setNewDeadline] = useState(gameState.settings.deadlineMonths);

  const totalBingo = gameState.drawnNumbers.reduce((a, b) => a + b, 0);
  const totalSaved = totalBingo + (gameState.settings.initialInvestment || 0);
  const totalGoal = gameState.settings.totalBingoGoal + (gameState.settings.initialInvestment || 0);
  const progress = Math.min(100, (totalSaved / totalGoal) * 100);

  const isGameOver = gameState.availableNumbers.length === 0;

  // Ensure retention is initialized (for old saves)
  const retentionState: RetentionState = gameState.retention || {
    coupleStreak: 0,
    lastPlayDate: null,
    survivalMode: false,
    lastActivityDate: new Date().toISOString()
  };

  const isRitualDay = useMemo(() => {
    return new Date().getDay() === (gameState.settings.ritualDay ?? 0);
  }, [gameState.settings.ritualDay]);

  const isSurvivalMode = useMemo(() => {
    // Check purely based on time if flag is not set, or trust flag
    return retentionState.survivalMode || checkInactivity(retentionState);
  }, [retentionState]);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={18} />;
    if (theme === 'dark') return <Moon size={18} />;
    return <Monitor size={18} />;
  };

  const numberOwners = useMemo(() => {
    const map = new Map<number, 'p1' | 'p2'>();
    gameState.history.forEach(tx => {
      map.set(tx.number, tx.playerId);
    });
    return map;
  }, [gameState.history]);

  const latestDrawData = useMemo(() => {
    if (gameState.history.length === 0) return null;
    const latestTimestamp = gameState.history[0].timestamp;
    const latestBatch = gameState.history.filter(tx => tx.timestamp === latestTimestamp);

    const p1Numbers = latestBatch.filter(tx => tx.playerId === 'p1').map(tx => tx.number).sort((a, b) => a - b);
    const p2Numbers = latestBatch.filter(tx => tx.playerId === 'p2').map(tx => tx.number).sort((a, b) => a - b);

    const p1Sum = p1Numbers.reduce((a, b) => a + b, 0);
    const p2Sum = p2Numbers.reduce((a, b) => a + b, 0);

    return {
      date: latestBatch[0].date,
      p1Numbers,
      p2Numbers,
      p1Sum,
      p2Sum,
      total: p1Sum + p2Sum
    };
  }, [gameState.history]);

  const checkCompletedCards = (drawnSet: Set<number>) => {
    let completed = 0;
    const totalNums = gameState.settings.maxNumber;
    for (let i = 0; i < totalNums; i += CARD_SIZE) {
      const chunk = Array.from({ length: Math.min(CARD_SIZE, totalNums - i) }, (_, j) => i + j + 1);
      const isComplete = chunk.every(n => drawnSet.has(n));
      if (isComplete) completed++;
    }
    return completed;
  };

  const bingoCards = useMemo(() => {
    const cards = [];
    const totalNums = gameState.settings.maxNumber;
    for (let i = 0; i < totalNums; i += CARD_SIZE) {
      const chunk = Array.from({ length: Math.min(CARD_SIZE, totalNums - i) }, (_, j) => i + j + 1);
      const isComplete = chunk.every(n => numberOwners.has(n));
      cards.push({
        id: i / CARD_SIZE + 1,
        numbers: chunk,
        isComplete
      });
    }
    return cards;
  }, [gameState.settings.maxNumber, numberOwners]);

  const performDraw = () => {
    const available = gameState.availableNumbers;
    if (available.length === 0) return;

    const existingDrawnSet = new Set<number>(gameState.drawnNumbers);
    const completedBefore = checkCompletedCards(existingDrawnSet);

    let drawCount = gameState.settings.monthlyTarget;
    // Survival Mode logic: Allow smaller draws if in survival mode to keep habit
    if (isSurvivalMode) {
      // Just suggestion, but keeping same logic for now to not break core rules, 
      // user can stop anytime. 
      // We could prompt "Draw less?" but let's stick to update logic.
    }
    if (available.length < drawCount) drawCount = available.length;

    const p1Count = Math.ceil(drawCount / 2);
    const p2Count = drawCount - p1Count;

    const newDraws: number[] = [];
    const p1Draws: number[] = [];
    const p2Draws: number[] = [];
    let currentAvailable = [...available];

    const currentTimestamp = Date.now();
    const currentDate = new Date().toLocaleDateString('pt-BR');

    for (let i = 0; i < p1Count; i++) {
      if (currentAvailable.length === 0) break;
      const num = drawWeightedNumber(currentAvailable, gameState.players.p1, gameState.availableNumbers);
      p1Draws.push(num);
      newDraws.push(num);
      currentAvailable = currentAvailable.filter(n => n !== num);
    }

    for (let i = 0; i < p2Count; i++) {
      if (currentAvailable.length === 0) break;
      const num = drawWeightedNumber(currentAvailable, gameState.players.p2, gameState.availableNumbers);
      p2Draws.push(num);
      newDraws.push(num);
      currentAvailable = currentAvailable.filter(n => n !== num);
    }

    const newDrawnSet = new Set<number>([...gameState.drawnNumbers, ...newDraws]);
    const completedAfter = checkCompletedCards(newDrawnSet);

    if (completedAfter > completedBefore) {
      const rewards = [
        "Jantar Romântico! 🍝🍷",
        "Vale Massagem! 💆‍♂️💆‍♀️",
        "Noite de Filmes + Pizza! 🍕🎬",
        "Café da Manhã na Cama! 🥞☕",
        "Vale Pedido Especial! 🎫✨",
        "Piquenique no Parque! 🥪🌳",
        "Vinho e Queijos! 🍷🧀"
      ];
      setBingoReward(rewards[Math.floor(Math.random() * rewards.length)]);
      setShowBingoModal(true);
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(), number: newDraws.reduce((a, b) => a + b, 0),
      playerId: 'p1', date: currentDate, type: 'monthly', timestamp: currentTimestamp
    };

    const newTransactions: Transaction[] = [
      ...p1Draws.map(n => ({ id: crypto.randomUUID(), number: n, playerId: 'p1', date: currentDate, type: 'monthly', timestamp: currentTimestamp } as Transaction)),
      ...p2Draws.map(n => ({ id: crypto.randomUUID(), number: n, playerId: 'p2', date: currentDate, type: 'monthly', timestamp: currentTimestamp } as Transaction))
    ];

    // RETENTION UPDATE
    const newRetention = calculateRetentionUpdate(retentionState);

    onUpdateState({
      ...gameState,
      availableNumbers: currentAvailable,
      drawnNumbers: [...newDraws, ...gameState.drawnNumbers],
      history: [...newTransactions, ...gameState.history],
      lastDraw: { ...transaction, number: 0 } as any,
      players: {
        p1: { ...gameState.players.p1, totalContributed: gameState.players.p1.totalContributed + p1Draws.reduce((a, b) => a + b, 0) },
        p2: { ...gameState.players.p2, totalContributed: gameState.players.p2.totalContributed + p2Draws.reduce((a, b) => a + b, 0) }
      },
      retention: newRetention
    });
  };

  const handlePenalty = (loserId: 'p1' | 'p2') => {
    if (gameState.availableNumbers.length === 0) return;
    const idx = Math.floor(Math.random() * gameState.availableNumbers.length);
    const number = gameState.availableNumbers[idx];

    const transaction: Transaction = {
      id: crypto.randomUUID(), number, playerId: loserId, date: new Date().toLocaleDateString('pt-BR'),
      type: 'extra', loserName: gameState.players[loserId].name, timestamp: Date.now()
    };

    // Minor retention activity update (doesn't count as full streak day usually, but keeps alive)
    const newRetention = { ...retentionState, lastActivityDate: new Date().toISOString() };

    onUpdateState({
      ...gameState,
      availableNumbers: gameState.availableNumbers.filter(n => n !== number),
      drawnNumbers: [number, ...gameState.drawnNumbers],
      history: [transaction, ...gameState.history],
      players: {
        ...gameState.players,
        [loserId]: { ...gameState.players[loserId], totalContributed: gameState.players[loserId].totalContributed + number }
      },
      retention: newRetention
    });
    return number;
  };

  const handleUpdateIncome = () => {
    const inc1 = parseFloat(newP1Income) || 0;
    const inc2 = parseFloat(newP2Income) || 0;
    const newRatio = calculateIncomeRatio(inc1, inc2);
    onUpdateState({
      ...gameState,
      players: {
        p1: { ...gameState.players.p1, estimatedIncome: inc1, incomeShare: 100 - newRatio },
        p2: { ...gameState.players.p2, estimatedIncome: inc2, incomeShare: newRatio }
      }
    });
    setShowRouteModal(false);
  };

  const handleAddExtraValue = () => {
    const val = parseFloat(extraValue);
    if (!val || val <= 0) return;
    const { numbers } = findNumbersForExtraValue(gameState.availableNumbers, val);
    if (numbers.length === 0) { alert("Não foi possível abater números com este valor."); return; }

    const newAvailable = gameState.availableNumbers.filter(n => !numbers.includes(n));
    const newMonthlyTarget = calculateMonthlyTarget(newAvailable.length, gameState.settings.deadlineMonths);
    const p2Ratio = gameState.players.p2.incomeShare / 100;
    const p1Portion = Math.round(val * (1 - p2Ratio));
    const p2Portion = val - p1Portion;
    const p2Count = Math.round(numbers.length * p2Ratio);

    const newTransactions: Transaction[] = [];
    numbers.forEach((num, idx) => {
      const isP2 = idx < p2Count;
      newTransactions.push({
        id: crypto.randomUUID(), number: num, playerId: isP2 ? 'p2' : 'p1',
        date: new Date().toLocaleDateString('pt-BR'), type: 'bonus', timestamp: Date.now()
      });
    });

    const newRetention = calculateRetentionUpdate(retentionState);

    onUpdateState({
      ...gameState,
      availableNumbers: newAvailable,
      drawnNumbers: [...numbers, ...gameState.drawnNumbers],
      history: [...newTransactions, ...gameState.history],
      settings: { ...gameState.settings, monthlyTarget: newMonthlyTarget },
      players: {
        p1: { ...gameState.players.p1, totalContributed: gameState.players.p1.totalContributed + p1Portion },
        p2: { ...gameState.players.p2, totalContributed: gameState.players.p2.totalContributed + p2Portion }
      },
      retention: newRetention
    });
    setShowRouteModal(false);
    setExtraValue('');
    alert(`Sucesso! ${numbers.length} números abatidos.`);
  };

  const handleUpdateDeadline = () => {
    const newMonthlyTarget = calculateMonthlyTarget(gameState.availableNumbers.length, newDeadline);
    onUpdateState({
      ...gameState,
      settings: { ...gameState.settings, deadlineMonths: newDeadline, monthlyTarget: newMonthlyTarget }
    });
    setShowRouteModal(false);
  };

  // This useMemo seems to be misplaced in the original instruction, assuming it should be here.
  // The instruction provided a `return { ... }` block followed by `}, [gameState.history]);`
  // which strongly suggests a useMemo hook.
  const latestBatch = useMemo(() => {
    const p1Numbers: number[] = [];
    const p2Numbers: number[] = [];
    let p1Sum = 0;
    let p2Sum = 0;

    const batch = gameState.history.filter(t => t.type === 'monthly');
    if (batch.length === 0) return null;

    const latestDate = batch[0].date;
    const latestBatch = batch.filter(t => t.date === latestDate);

    latestBatch.forEach(t => {
      if (t.playerId === 'p1') {
        p1Numbers.push(t.number);
        p1Sum += t.number;
      } else {
        p2Numbers.push(t.number);
        p2Sum += t.number;
      }
    });

    return {
      date: latestBatch[0].date,
      p1Numbers,
      p2Numbers,
      p1Sum,
      p2Sum,
    };
  }, [gameState.history]);

  const currentSkin = useMemo(() => {
    const skinKey = (gameState.settings.skin || 'default') as SkinType;
    return SKINS[skinKey] || SKINS.default;
  }, [gameState.settings.skin]);

  const skinStyles = {
    '--primary-color': currentSkin.primaryColor,
    '--secondary-color': currentSkin.secondaryColor,
    '--accent-color': currentSkin.accentColor,
  } as React.CSSProperties;

  const handleCoachUsed = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const usage = gameState.retention?.coachUsage || { lastUsageMonth: currentMonth, count: 0 };
    const newCount = usage.lastUsageMonth === currentMonth ? usage.count + 1 : 1;

    onUpdateState({
      ...gameState,
      retention: {
        ...retentionState,
        coachUsage: { lastUsageMonth: currentMonth, count: newCount }
      }
    });
  };

  if (isGameOver) {
    return <GameSummary gameState={gameState} onReset={onReset} />;
  }

  return (
    <div
      className={`min-h-screen ${currentSkin.bgClass} text-slate-800 dark:text-slate-100 font-sans pb-20 transition-colors duration-500`}
      style={skinStyles}
    >
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3 shadow-sm transition-colors duration-500">
        <div className="max-w-md mx-auto flex gap-3 justify-between items-center">
          <div className="flex items-center gap-2">
            {/* SVG Logo Miniatura */}
            <BingoLogo className="w-10 h-10 border-[1.5px]" />
            <div className="flex flex-col">
              <h1 className="font-black text-brand-purple dark:text-brand-gold tracking-tight leading-none">
                {gameState.settings.customGoalName || 'Bingo2Gether'}
              </h1>
              {/* STREAK INDICATOR */}
              {retentionState.coupleStreak > 0 && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Flame size={10} className="text-orange-500 fill-orange-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest leading-none">
                    {retentionState.coupleStreak} dias seguidos
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!gameState.settings.isPro && (
              <button
                onClick={() => setShowPricingModal(true)}
                className="hidden sm:flex items-center gap-1.5 bg-brand-gold/20 text-brand-gold px-3 py-1.5 rounded-full border border-brand-gold/30 hover:bg-brand-gold/30 transition-all active:scale-95"
              >
                <Crown size={12} className="fill-current" />
                <span className="text-[10px] font-black uppercase tracking-widest">PRO</span>
              </button>
            )}
            <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm">
              {getThemeIcon()}
            </button>
            <button onClick={() => setShowRouteModal(true)} className="bg-brand-purple hover:bg-brand-purple/90 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-95">
              <MapIcon size={16} /> <span className="hidden sm:inline">Ajuste</span>
            </button>
          </div>
        </div>
      </header>

      {/* NOTIFICATION BANNERS */}
      <div className="max-w-md mx-auto px-4 mt-2 space-y-2">
        {/* RITUAL DAY BANNER */}
        {isRitualDay && !isGameOver && (
          <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-xl p-3 flex items-center gap-3 animate-in slide-in-from-top-2">
            <div className="bg-white dark:bg-slate-900 p-1.5 rounded-lg text-pink-500 shadow-sm">
              <CalendarHeart size={16} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest">Dia de Conexão</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-tight">Hoje é dia de Bingo2Gether! Que tal avançar um pouco juntos?</p>
            </div>
          </div>
        )}

        {/* SURVIVAL MODE BANNER */}
        {isSurvivalMode && !isGameOver && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-center gap-3 animate-in slide-in-from-top-2">
            <div className="bg-white dark:bg-slate-900 p-1.5 rounded-lg text-amber-500 shadow-sm">
              <TrendingDown size={16} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Modo Meses Difíceis</p>
              <p className="text-xs text-amber-800 dark:text-amber-200 font-medium leading-tight">O mês apertou? Jogar pequeno ainda é jogar. A dupla continua!</p>
            </div>
          </div>
        )}
      </div>

      {showBingoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowBingoModal(false)}>
          <div
            className={`rounded-[3rem] p-10 max-w-sm w-full text-center relative overflow-hidden shadow-2xl animate-in zoom-in-50 duration-500 border-4 ${currentSkin.id === 'default' ? 'bg-white dark:bg-slate-900 border-brand-gold' : currentSkin.cardClass}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-brand-gold via-brand-magenta to-brand-gold animate-pulse"></div>

            <div className="mb-6 inline-block relative scale-125">
              <div className="text-7xl drop-shadow-lg mx-auto transform hover:scale-110 transition-transform">
                {currentSkin.icons.goal}
              </div>
              <Sparkles className="w-10 h-10 text-brand-magenta absolute -top-2 -right-4 animate-bounce" />
            </div>

            <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-brand-gold to-brand-magenta tracking-tighter mb-2 drop-shadow-sm">BINGO!</h2>
            <p className="text-xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-widest">Parabéns ao Casal!</p>

            <div className="bg-brand-gold/10 dark:bg-brand-gold/20 p-6 rounded-[2rem] border border-brand-gold/20 mb-8 relative">
              <p className="text-slate-600 dark:text-slate-300 font-bold leading-tight text-sm">
                Mais uma cartela conquistada! Vocês estão cada vez mais próximos do sonho.
              </p>
              <div className="mt-4 pt-4 border-t border-brand-gold/20">
                <p className="text-[10px] text-brand-purple dark:text-brand-gold font-black uppercase tracking-widest mb-1">Prêmio Sugerido</p>
                <p className="text-xl font-black text-brand-purple dark:text-brand-gold">{bingoReward}</p>
              </div>
            </div>

            <button onClick={() => setShowBingoModal(false)} className="w-full py-5 bg-brand-purple text-white font-black rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95">
              VAMOS COMEMORAR!
            </button>
          </div>
        </div>
      )}

      <main className="max-w-md mx-auto p-4 space-y-6">

        <div className="flex p-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm transition-all">
          <button onClick={() => setTab('dashboard')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${tab === 'dashboard' ? 'bg-brand-purple text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50'}`}>Sorteio</button>
          <button onClick={() => setTab('grid')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${tab === 'grid' ? 'bg-brand-purple text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50'}`}>Cartelas</button>
        </div>

        {tab === 'dashboard' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">

            {!gameState.settings.isPro && (
              <div
                onClick={() => setShowPricingModal(true)}
                className="bg-gradient-to-r from-brand-purple to-brand-magenta p-[2px] rounded-[2.5rem] cursor-pointer hover:scale-[1.01] transition-all shadow-xl shadow-brand-purple/20"
              >
                <div className="bg-white dark:bg-slate-900 rounded-[2.4rem] p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-gold/20 rounded-2xl">
                      <Crown className="text-brand-gold" size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-brand-purple dark:text-brand-gold uppercase tracking-widest text-xs">Ativar Versão PRO</h4>
                      <p className="text-[10px] text-slate-500 font-bold">Libere sincronização cloud e I.A. preditiva</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-brand-gold" />
                </div>
              </div>
            )}

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[2.5rem] p-1.5 border-2 border-brand-purple/10 dark:border-brand-purple/20 shadow-xl shadow-brand-purple/5 transition-all">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-brand-purple/5 mb-1">
                <Sparkles size={16} className="text-brand-magenta fill-brand-magenta" />
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Coach de IA Bingo2Gether</span>
              </div>
              <div className="flex gap-2 p-2 pt-0">
                <button onClick={() => setCoachMode('incentive')} className="flex-1 bg-brand-purple/10 dark:bg-brand-purple/20 hover:bg-brand-purple/20 py-4 rounded-2xl text-brand-purple dark:text-brand-purple font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
                  💡 Dica
                </button>
                <button onClick={() => setCoachMode('challenge')} className="flex-1 bg-brand-magenta/10 dark:bg-brand-magenta/20 hover:bg-brand-magenta/20 py-4 rounded-2xl text-brand-magenta dark:text-brand-magenta font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
                  🥊 Desafio
                </button>
              </div>
            </div>

            <div className="bg-brand-purple dark:bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden transition-all border border-white/5">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-magenta/20 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 opacity-80">
                      <Trophy size={16} className="text-brand-gold" />
                      <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Vocês já guardaram</p>
                    </div>
                    <p className="text-5xl font-black text-white tracking-tighter">{formatCurrency(totalSaved)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white drop-shadow-sm">{progress.toFixed(1)}%</p>
                    <p className="text-[10px] font-black text-brand-gold/60 uppercase tracking-widest">da meta</p>
                  </div>
                </div>

                <div className="h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-md border border-white/10 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-brand-magenta via-brand-gold to-brand-magenta shadow-[0_0_20px_rgba(230,194,110,0.4)] transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">Meta Final: {formatCurrency(totalGoal)}</p>

                  {/* PRO FEATURE SIMULATION: PREDICTION */}
                  {!gameState.settings.isPro && (
                    <div className="flex items-center gap-1.5 opacity-60">
                      <Lock size={10} className="text-brand-gold" />
                      <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest">Previsão Pro</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-brand-magenta dark:bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all border border-white/5">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-gold/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-white/60 text-[10px] font-black uppercase mb-1 flex items-center gap-2 tracking-widest"><Calendar size={12} /> Meta Mensal</h3>
                  <div className="text-4xl font-black flex items-baseline gap-2 text-white tracking-tight">
                    {gameState.settings.monthlyTarget} <span className="text-xs font-black text-white/60 uppercase tracking-widest">números</span>
                  </div>
                </div>
                <button
                  onClick={performDraw}
                  className="bg-white text-brand-purple hover:bg-slate-50 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 active:scale-95 group"
                >
                  <RotateCcw size={18} className="group-active:rotate-180 transition-transform duration-500" /> Sortear
                </button>
              </div>
            </div>

            {/* Rest of the UI follows the same aesthetic cleanup... */}
            {latestDrawData && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">
                  Resultado do Último Mês <span className="text-slate-300 dark:text-slate-700 font-bold">({latestDrawData.date})</span>
                </p>
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currentSkin.id === 'default' ? gameState.players.p1.avatar : currentSkin.icons.player1}</span>
                      <span className="font-black text-slate-800 dark:text-slate-300 text-xs uppercase tracking-widest">{gameState.players.p1.name}</span>
                    </div>
                    <span className="font-black text-brand-purple dark:text-brand-gold bg-brand-purple/5 dark:bg-brand-gold/10 px-3 py-1.5 rounded-xl text-xs">{formatCurrency(latestDrawData.p1Sum)}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-50 dark:border-slate-800 pb-6">
                    {latestDrawData.p1Numbers.map(n => (
                      <span key={n} className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 px-3 py-2 rounded-xl text-[10px] font-black shadow-sm">{n}</span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currentSkin.id === 'default' ? gameState.players.p2.avatar : currentSkin.icons.player2}</span>
                      <span className="font-black text-slate-800 dark:text-slate-300 text-xs uppercase tracking-widest">{gameState.players.p2.name}</span>
                    </div>
                    <span className="font-black text-brand-magenta dark:text-brand-magenta bg-brand-magenta/5 dark:bg-brand-magenta/10 px-3 py-1.5 rounded-xl text-xs">{formatCurrency(latestDrawData.p2Sum)}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {latestDrawData.p2Numbers.map(n => (
                      <span key={n} className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 px-3 py-2 rounded-xl text-[10px] font-black shadow-sm">{n}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 mt-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                <TrendingUp size={14} /> Contribuições Totais
              </p>
              <div className="bg-brand-purple text-white rounded-[2.5rem] p-8 shadow-2xl flex divide-x divide-white/10 transition-all">
                <div className="flex-1 text-center pr-4">
                  <p className="text-3xl mb-1">{currentSkin.id === 'default' ? gameState.players.p1.avatar : currentSkin.icons.player1}</p>
                  <p className="text-2xl font-black tracking-tight">{formatCurrency(gameState.players.p1.totalContributed)}</p>
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mt-1 truncate">{gameState.players.p1.name}</p>
                </div>
                <div className="flex-1 text-center pl-4">
                  <p className="text-3xl mb-1">{currentSkin.id === 'default' ? gameState.players.p2.avatar : currentSkin.icons.player2}</p>
                  <p className="text-2xl font-black tracking-tight">{formatCurrency(gameState.players.p2.totalContributed)}</p>
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mt-1 truncate">{gameState.players.p2.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'grid' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 transition-all">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xs font-black text-brand-purple dark:text-brand-gold uppercase tracking-widest">Painel de Cartelas</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{gameState.settings.maxNumber} números totais</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowPrintModal(true)} className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl hover:bg-slate-200 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 shadow-sm transition-all active:scale-95">
                  <Printer size={14} /> Imprimir
                </button>
              </div>
            </div>

            <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {bingoCards.map(card => (
                <div key={card.id} className="relative">
                  {card.isComplete && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 rounded-[2rem] backdrop-blur-[1px] animate-in zoom-in duration-300">
                      <div className="bg-brand-gold text-brand-purple font-black text-2xl -rotate-12 py-3 px-12 shadow-2xl border-4 border-white animate-pulse flex items-center gap-3">
                        <Trophy size={28} /> BINGO!
                      </div>
                    </div>
                  )}
                  <div className={`bg-white dark:bg-slate-800 rounded-[2rem] p-5 border-2 transition-all ${card.isComplete ? 'border-brand-gold' : 'border-slate-50 dark:border-slate-800 shadow-sm'}`}>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 flex justify-between tracking-widest">
                      <span>Cartela #{card.id}</span>
                      {card.isComplete && <span className="text-brand-gold flex items-center gap-1 font-black">✨ COMPLETA</span>}
                    </h4>
                    <div className="grid grid-cols-5 gap-3">
                      {card.numbers.map(num => {
                        const owner = numberOwners.get(num);
                        const isUsed = owner !== undefined;
                        let bgClass = 'bg-slate-50/50 dark:bg-slate-900 text-slate-200 dark:text-slate-700 border-none';
                        if (owner === 'p1') bgClass = 'bg-brand-purple text-white shadow-md font-black scale-105 z-10';
                        if (owner === 'p2') bgClass = 'bg-brand-magenta text-white shadow-md font-black scale-105 z-10';
                        return (
                          <div key={num} className={`aspect-square flex items-center justify-center rounded-xl text-[11px] transition-all duration-300 ${bgClass}`}>
                            <span>{num}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal logic remains same but with updated styling to match logo image colors... */}
      {showRouteModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-black flex items-center gap-2 text-brand-purple dark:text-brand-gold uppercase tracking-widest text-sm"><Settings2 size={18} /> Ajuste da Rota</h3>
              <button onClick={() => setShowRouteModal(false)} className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-all"><X size={20} /></button>
            </div>

            <div className="flex border-b border-slate-100 dark:border-slate-700">
              <button onClick={() => setRouteTab('income')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${routeTab === 'income' ? 'text-brand-purple border-b-4 border-brand-purple bg-brand-purple/5' : 'text-slate-400'}`}>Nossa renda mudou</button>
              <button onClick={() => setRouteTab('extra')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${routeTab === 'extra' ? 'text-brand-magenta border-b-4 border-brand-magenta bg-brand-magenta/5' : 'text-slate-400'}`}>Caiu dinheiro extra</button>
              <button onClick={() => setRouteTab('skins')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${routeTab === 'skins' ? 'text-brand-gold border-b-4 border-brand-gold bg-brand-gold/5' : 'text-slate-400'}`}>Skins</button>
              {!gameState.settings.isPro && (
                <button onClick={() => setShowPricingModal(true)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all text-brand-gold bg-brand-gold/10 border-b-4 border-brand-gold animate-pulse">🔥 Seja PRO</button>
              )}
            </div>

            <div className="p-8">
              {routeTab === 'income' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{gameState.players.p1.name}</label>
                    <input type="number" value={newP1Income} onChange={e => setNewP1Income(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 font-black focus:border-brand-purple outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{gameState.players.p2.name}</label>
                    <input type="number" value={newP2Income} onChange={e => setNewP2Income(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 font-black focus:border-brand-purple outline-none" />
                  </div>
                  <button onClick={handleUpdateIncome} className="w-full py-5 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest mt-4 shadow-xl active:scale-95 transition-all">Salvar Alterações</button>
                </div>
              )}
              {routeTab === 'extra' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor Extra Recebido</label>
                    <input type="number" value={extraValue} onChange={e => setExtraValue(e.target.value)} placeholder="R$ 0,00" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-5 font-black text-2xl focus:border-brand-magenta outline-none" />
                  </div>
                  <button onClick={handleAddExtraValue} className="w-full py-5 bg-brand-magenta text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">Abater Números <ArrowRight size={20} /></button>
                </div>
              )}
              {routeTab === 'deadline' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <span className="text-6xl font-black text-brand-gold tracking-tighter">{newDeadline}</span>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mt-1">meses restantes</span>
                  </div>
                  <input type="range" min="1" max="60" value={newDeadline} onChange={(e) => setNewDeadline(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-gold" />
                  <button onClick={handleUpdateDeadline} className="w-full py-5 bg-brand-gold text-brand-purple rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Atualizar Prazo</button>
                </div>
              )}
              {routeTab === 'skins' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {(Object.keys(SKINS) as SkinType[]).map((skinId) => {
                      const s = SKINS[skinId];
                      const isAcquired = skinId === 'default' || gameState.settings.isPro;
                      const isSelected = gameState.settings.skin === skinId || (!gameState.settings.skin && skinId === 'default');

                      return (
                        <button
                          key={skinId}
                          disabled={!isAcquired}
                          onClick={() => {
                            onUpdateState({
                              ...gameState,
                              settings: { ...gameState.settings, skin: skinId }
                            });
                          }}
                          className={`relative p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${isSelected
                            ? 'border-brand-gold bg-brand-gold/5 shadow-lg scale-[1.02]'
                            : 'border-slate-100 dark:border-slate-800 hover:border-brand-gold/30'
                            } ${!isAcquired ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner border border-black/5" style={{ background: s.primaryColor }}>
                              {s.icons.goal}
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.name}</p>
                              <div className="flex gap-1 mt-1">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.primaryColor }}></div>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.accentColor }}></div>
                              </div>
                            </div>
                          </div>
                          {!isAcquired && <Lock size={14} className="text-slate-400" />}
                          {isSelected && <div className="bg-brand-gold p-1 rounded-full"><Sparkles size={10} className="text-brand-purple fill-current" /></div>}
                        </button>
                      );
                    })}
                  </div>
                  {!gameState.settings.isPro && (
                    <p className="text-[9px] text-center font-bold text-brand-gold uppercase tracking-[0.2em] mt-4 animate-pulse">Skins exclusivas no plano PRO</p>
                  )}
                </div>
              )}

              {/* Reset Game Section */}
              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">Zona de Perigo</p>
                <button
                  onClick={() => {
                    if (window.confirm("Isso apagará todo seu progresso local. Tem certeza?")) {
                      onReset();
                    }
                  }}
                  className="w-full py-4 border-2 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95"
                >
                  Reiniciar Todo o Jogo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {coachMode && (
        <GeminiCoach
          initialMode={coachMode}
          p1={gameState.players.p1}
          p2={gameState.players.p2}
          progressPercent={progress}
          onClose={() => setCoachMode(null)}
          onChallengeAccepted={handlePenalty}
          isPro={gameState.settings.isPro}
          gameState={gameState}
          onCoachUsed={handleCoachUsed}
          onPricingOpen={() => { setCoachMode(null); setShowPricingModal(true); }}
          currentSkin={currentSkin}
        />
      )}

      {/* Print Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowPrintModal(false)}>
          <div
            className={`rounded-[3rem] p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl animate-in zoom-in-50 duration-500 border-4 bg-white dark:bg-slate-900 border-brand-gold`}
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-brand-gold via-brand-magenta to-brand-gold animate-pulse"></div>

            <div className="mb-6">
              <Printer size={48} className="mx-auto text-brand-purple dark:text-brand-gold" />
            </div>

            <h2 className="text-2xl font-black text-brand-purple dark:text-brand-gold tracking-tight mb-2">Escolha o tipo de Impressão</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-8 font-bold">Qual formato você deseja imprimir?</p>

            <div className="space-y-3">
              <div className="flex gap-2 justify-center mb-2">
                <label className="text-[10px] font-black text-slate-400 mr-2">Cartelas / folha:</label>
                {[1,2,3,4].map(n => (
                  <button
                    key={n}
                    onClick={() => setCartelasPerPage(n)}
                    className={`py-2 px-3 rounded-xl text-sm font-black ${cartelasPerPage===n ? 'bg-brand-purple text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {n}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                              setPrintType('cartelas');
                  setShowPrintModal(false);
                  setTimeout(() => {
                    window.print();
                    setTimeout(() => setPrintType(null), 500);
                  }, 100);
                }}
                className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
              >
                <Grid size={20} /> Cartelas
              </button>

              <button
                onClick={() => {
                  setPrintType('tabela');
                  setShowPrintModal(false);
                  setTimeout(() => {
                    window.print();
                    setTimeout(() => setPrintType(null), 500);
                  }, 100);
                }}
                className="w-full bg-brand-magenta hover:bg-brand-magenta/90 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
              >
                <List size={20} /> Tabela Corrida
              </button>

              <button
                onClick={() => setShowPrintModal(false)}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <PrintView printType={printType} bingoCards={bingoCards} maxNumber={gameState.settings.maxNumber} gameState={gameState} cartelasPerPage={cartelasPerPage} />

      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
    </div>
  );
};

export default Dashboard;
