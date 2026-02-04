import prisma from '../prisma.js';
import { Game } from '@prisma/client';

export class GameService {
    static async getGameByUserId(userId: string) {
        return prisma.game.findFirst({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
    }

    static async saveGame(userId: string, state: any) {
        const existingGame = await prisma.game.findFirst({
            where: { userId },
        });

        if (existingGame) {
            return prisma.game.update({
                where: { id: existingGame.id },
                data: {
                    state,
                    isSetup: state.isSetup || false,
                    lastPlayedAt: new Date(),
                },
            });
        }

        return prisma.game.create({
            data: {
                userId,
                state,
                isSetup: state.isSetup || false,
                lastPlayedAt: new Date(),
            },
        });
    }

    static async resetGame(userId: string) {
        return prisma.game.deleteMany({
            where: { userId },
        });
    }
}
