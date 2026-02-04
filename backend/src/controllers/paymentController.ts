import { Request, Response } from 'express';
import { StripeService } from '../services/payments/stripeService.js';
import { MercadoPagoService } from '../services/payments/mercadopagoService.js';
import prisma from '../prisma.js';

export class PaymentController {
    static async createStripeSession(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const session = await StripeService.createCheckoutSession(user.id, user.email);
            res.json({ url: session.url });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createMercadoPagoPreference(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            const preference = await MercadoPagoService.createPreference(user.id, user.email);
            res.json({ init_point: preference.init_point });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async handleStripeWebhook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'] as string;
        let event;

        try {
            event = await StripeService.constructEvent(req.body, sig);
        } catch (err: any) {
            console.error(`Webhook Error: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as any;
            await this.handleSuccessfulPayment(
                session.client_reference_id,
                'stripe',
                session.id,
                (session.amount_total || 0) / 100
            );
        }

        res.json({ received: true });
    }

    static async handleMercadoPagoWebhook(req: Request, res: Response) {
        try {
            const { action, data } = req.body;

            if (action === 'payment.created' || action === 'payment.updated') {
                if (data?.id) {
                    const paymentInfo = await MercadoPagoService.getPayment(data.id);

                    if (paymentInfo.status === 'approved') {
                        const userId = paymentInfo.external_reference;
                        if (userId) {
                            await this.handleSuccessfulPayment(
                                userId,
                                'mercadopago',
                                data.id,
                                paymentInfo.transaction_amount || 0
                            );
                        }
                    }
                }
            }

            res.status(200).send('OK');
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    private static async handleSuccessfulPayment(userId: string, provider: string, paymentId: string, amount: number) {
        try {
            await prisma.$transaction([
                // 1. Upgrade User
                prisma.user.update({
                    where: { id: userId },
                    data: {
                        isPro: true,
                        proExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
                    }
                }),
                // 2. Log Payment
                prisma.payment.create({
                    data: {
                        userId,
                        provider,
                        providerId: paymentId,
                        amount,
                        status: 'completed'
                    }
                })
            ]);
            console.log(`✅ User ${userId} upgraded to PRO via ${provider}`);
        } catch (error) {
            console.error('Error upgrading user:', error);
        }
    }
}
