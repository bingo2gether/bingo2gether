import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Check, Zap, Star, Shield, Cloud,
    Crown, ArrowRight, CreditCard, Sparkles
} from 'lucide-react';
import { paymentService } from '../../services/paymentService';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState<'stripe' | 'mp' | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'lifetime'>('annual');

    const plans = {
        monthly: { name: 'Mensal', price: '19,90', period: '/ mês', saving: null },
        annual: { name: 'Anual', price: '119,90', period: '/ ano', saving: '50% OFF', best: true },
        lifetime: { name: 'Vitalício', price: '149,90', period: '', saving: 'Investimento Único' }
    };

    const handleStripePayment = async () => {
        setLoading('stripe');
        try {
            // Em produção aqui passaríamos o plan ID selecionado
            const { url } = await paymentService.createStripeSession();
            window.location.href = url;
        } catch (error) {
            console.error("Stripe error", error);
            alert("Erro ao iniciar Stripe. Tente novamente.");
        } finally {
            setLoading(null);
        }
    };

    const handleMPPayment = async () => {
        setLoading('mp');
        try {
            const { init_point } = await paymentService.createMPPreference();
            window.location.href = init_point;
        } catch (error) {
            console.error("Mercado Pago error", error);
            alert("Erro ao iniciar Mercado Pago. Tente novamente.");
        } finally {
            setLoading(null);
        }
    };

    const features = [
        { icon: <Cloud size={18} />, text: "Sincronização Cloud Ilimitada" },
        { icon: <Zap size={18} />, text: "IA Predictor: Previsão de metas" },
        { icon: <Shield size={18} />, text: "Segurança de Nível Bancário" },
        { icon: <Star size={18} />, text: "Skins Exclusivas (MatriMoney)" },
        { icon: <Sparkles size={18} />, text: "Desafios de IA Personalizados" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        {/* Header / Banner */}
                        <div className="relative h-32 bg-slate-950 flex items-center justify-center overflow-hidden">
                            <video
                                src="/splash.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>

                            <div className="relative z-10 text-center flex items-center gap-4">
                                <div className="p-3 bg-brand-gold/20 rounded-2xl backdrop-blur-md">
                                    <Crown className="text-brand-gold" size={28} />
                                </div>
                                <h2 className="text-xl font-black text-white tracking-widest uppercase italic drop-shadow-lg">Bingo2Gether PRO</h2>
                            </div>

                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-20 backdrop-blur-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 md:p-8">
                            {/* Plan Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                                {(Object.entries(plans) as [keyof typeof plans, any][]).map(([id, plan]) => (
                                    <button
                                        key={id}
                                        onClick={() => setSelectedPlan(id)}
                                        className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center ${selectedPlan === id
                                            ? 'border-brand-gold bg-brand-gold/10'
                                            : 'border-white/10 bg-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        {plan.best && (
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-purple text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg">
                                                Recomendado
                                            </div>
                                        )}
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{plan.name}</span>
                                        <div className="text-xl font-black text-white">R$ {plan.price}</div>
                                        {plan.saving && (
                                            <span className="text-[8px] font-bold text-emerald-400 mt-1">{plan.saving}</span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between items-center mb-8 px-2">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{plans[selectedPlan].name}</p>
                                    <h3 className="text-4xl font-black text-white flex items-baseline gap-2">
                                        R$ {plans[selectedPlan].price}
                                        <span className="text-sm text-slate-500 font-medium">{plans[selectedPlan].period}</span>
                                    </h3>
                                </div>
                                {selectedPlan === 'annual' && (
                                    <div className="bg-brand-gold text-brand-purple px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-brand-gold/20 animate-bounce">
                                        Economize 50%
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-10 px-2">
                                {features.map((f, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        className="flex items-center gap-3 text-slate-300"
                                    >
                                        <div className="text-brand-gold shrink-0">
                                            {f.icon}
                                        </div>
                                        <span className="text-[11px] font-bold">{f.text}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    disabled={!!loading}
                                    onClick={handleStripePayment}
                                    className="group relative bg-white hover:bg-slate-50 text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl disabled:opacity-50"
                                >
                                    {loading === 'stripe' ? (
                                        <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <CreditCard size={18} />
                                            Cartão Internacional
                                        </>
                                    )}
                                </button>

                                <button
                                    disabled={!!loading}
                                    onClick={handleMPPayment}
                                    className="group relative bg-brand-purple hover:opacity-90 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl disabled:opacity-50"
                                >
                                    {loading === 'mp' ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo.png" className="h-4 invert brightness-200" alt="MP" />
                                            Pix / Brasil
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="mt-6 text-[9px] text-center text-slate-600 font-bold uppercase tracking-widest">
                                Cancele a qualquer momento. Pagamento processado com segurança.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PricingModal;
