import webpush from 'web-push';
import prisma from '../../prisma.js';

export class PushService {
    constructor() {
        const publicKey = process.env.VAPID_PUBLIC_KEY;
        const privateKey = process.env.VAPID_PRIVATE_KEY;
        const subject = process.env.VAPID_SUBJECT || 'mailto:example@example.com';

        if (publicKey && privateKey) {
            webpush.setVapidDetails(subject, publicKey, privateKey);
        }
    }

    async saveSubscription(userId: string, subscription: any) {
        const endpoint = subscription.endpoint;

        // Check if subscription already exists
        const existing = await prisma.pushSubscription.findFirst({
            where: { userId, endpoint }
        });

        if (existing) {
            return prisma.pushSubscription.update({
                where: { id: existing.id },
                data: { data: subscription }
            });
        }

        return prisma.pushSubscription.create({
            data: {
                userId,
                endpoint,
                data: subscription
            }
        });
    }

    async sendNotification(userId: string, title: string, body: string, icon?: string, url?: string) {
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { userId }
        });

        const payload = JSON.stringify({
            notification: {
                title,
                body,
                icon: icon || '/icon-192x192.png',
                data: {
                    url: url || '/'
                }
            }
        });

        const results = await Promise.allSettled(
            subscriptions.map((sub: any) =>
                webpush.sendNotification(sub.data as any, payload)
            )
        );

        // Clean up expired subscriptions
        for (let i = 0; i < results.length; i++) {
            if (results[i].status === 'rejected') {
                const error = (results[i] as PromiseRejectedResult).reason;
                if (error.statusCode === 404 || error.statusCode === 410) {
                    await prisma.pushSubscription.delete({
                        where: { id: subscriptions[i].id }
                    });
                }
            }
        }

        return results;
    }
}

export const pushService = new PushService();
