export type SkinType = 'default' | 'matrimoney' | 'travel' | 'dark_luxury';

export interface SkinConfig {
    id: SkinType;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    bgClass: string;
    cardClass: string;
    buttonClass: string;
    icons: {
        goal: string;
        player1: string;
        player2: string;
    };
}

export const SKINS: Record<SkinType, SkinConfig> = {
    default: {
        id: 'default',
        name: 'Bingo Tradicional',
        primaryColor: '#C13C7A', // Magenta
        secondaryColor: '#6B3FA0', // Purple
        accentColor: '#E6C26E', // Gold
        bgClass: 'bg-slate-50 dark:bg-slate-950',
        cardClass: 'bg-white dark:bg-slate-900',
        buttonClass: 'bg-brand-purple text-white',
        icons: {
            goal: '🎯',
            player1: '👤',
            player2: '👤'
        }
    },
    matrimoney: {
        id: 'matrimoney',
        name: 'MatriMoney (Wedding)',
        primaryColor: '#D4AF37', // Gold
        secondaryColor: '#FFFAFA', // Snow White
        accentColor: '#0ABAB5', // Tiffany Blue
        bgClass: 'bg-[#FFFAFA] dark:bg-stone-950',
        cardClass: 'bg-white dark:bg-stone-900 border-[#D4AF37]/20 shadow-[0_10px_40px_-15px_rgba(212,175,55,0.15)]',
        buttonClass: 'bg-[#D4AF37] text-white shadow-[#D4AF37]/20',
        icons: {
            goal: '💍',
            player1: '🤵',
            player2: '👰'
        }
    },
    dark_luxury: {
        id: 'dark_luxury',
        name: 'Carbon PRO',
        primaryColor: '#E6C26E',
        secondaryColor: '#020617',
        accentColor: '#E6C26E',
        bgClass: 'bg-slate-950',
        cardClass: 'bg-slate-900 border-white/10',
        buttonClass: 'bg-brand-gold text-slate-900',
        icons: {
            goal: '💎',
            player1: '👑',
            player2: '👑'
        }
    },
    travel: {
        id: 'travel',
        name: 'Viagem & Aventura',
        primaryColor: '#0077B6', // Pacific Blue
        secondaryColor: '#F0F9FF', // Sky Mist
        accentColor: '#FF9F1C', // Sunset Orange
        bgClass: 'bg-[#F0F9FF] dark:bg-slate-950',
        cardClass: 'bg-white dark:bg-slate-900 border-[#0077B6]/10 shadow-[0_10px_30px_-15px_rgba(0,119,182,0.1)]',
        buttonClass: 'bg-[#0077B6] text-white shadow-[#0077B6]/20',
        icons: {
            goal: '✈️',
            player1: '🎒',
            player2: '📸'
        }
    }
};
