import prisma from '../prisma.js';
import { Game } from '@prisma/client';

export class GameService {
    static async getGameByUserId(userId: string) {
        return prisma.game.findFirst({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
    }

    static async saveGame(userId: string, state: any): Promise<void> {
        // Use updateMany for efficiency - updates all games for this user
        // This is optimal since it's a single database operation
        const updateResult = await prisma.game.updateMany({
            where: { userId },
            data: {
                state,
                isSetup: state.isSetup || false,
                lastPlayedAt: new Date(),
            },
        });

        // If no game exists yet, create one
        if (updateResult.count === 0) {
            await prisma.game.create({
                data: {
                    userId,
                    state,
                    isSetup: state.isSetup || false,
                    lastPlayedAt: new Date(),
                },
            });
        }
    }

    static async resetGame(userId: string) {
        return prisma.game.deleteMany({
            where: { userId },
        });
    }
}
