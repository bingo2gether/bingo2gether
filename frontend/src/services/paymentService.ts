import api from './api';

export const paymentService = {
    createStripeSession: async () => {
        const response = await api.post('/payments/stripe/create-checkout');
        return response.data; // { url: string }
    },

    createMPPreference: async () => {
        const response = await api.post('/payments/mercadopago/create-preference');
        return response.data; // { init_point: string }
    }
};
