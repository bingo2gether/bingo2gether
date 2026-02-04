import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

export class MercadoPagoService {
    static async createPreference(userId: string, userEmail: string) {
        const preference = new Preference(client);

        return preference.create({
            body: {
                items: [
                    {
                        id: 'pro-plan',
                        title: 'Bingo2Gether PRO',
                        quantity: 1,
                        unit_price: 9.90,
                        currency_id: 'BRL',
                    }
                ],
                payer: {
                    email: userEmail,
                },
                external_reference: userId,
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/payment/success`,
                    failure: `${process.env.FRONTEND_URL}/payment/failure`,
                    pending: `${process.env.FRONTEND_URL}/payment/pending`,
                },
                auto_return: 'approved',
                notification_url: `${process.env.API_URL}/payment/webhook/mp`,
                metadata: {
                    userId,
                }
            }
        });
    }

    static async getPayment(paymentId: string) {
        const payment = new Payment(client);
        return payment.get({ id: paymentId });
    }
}
