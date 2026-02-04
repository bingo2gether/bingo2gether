import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
});

export class StripeService {
    static async createCheckoutSession(userId: string, userEmail: string) {
        // if (!process.env.STRIPE_PRICE_ID) {
        //     throw new Error('STRIPE_PRICE_ID is not configured');
        // }

        return stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                (process.env.STRIPE_PRICE_ID && process.env.STRIPE_PRICE_ID !== 'price_placeholder_id')
                    ? {
                        price: process.env.STRIPE_PRICE_ID,
                        quantity: 1,
                    }
                    : {
                        price_data: {
                            currency: 'brl',
                            product_data: {
                                name: 'Bingo2Gether PRO (Anual)',
                                description: 'Acesso Vitalício e Recursos de IA',
                            },
                            unit_amount: 11990,
                            recurring: {
                                interval: 'year',
                            },
                        },
                        quantity: 1,
                    },
            ],
            mode: 'subscription',
            customer_email: userEmail,
            client_reference_id: userId,
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
            metadata: {
                userId,
            },
        });
    }

    static async constructEvent(payload: string | Buffer, sig: string) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET not set');

        return stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    }
}
