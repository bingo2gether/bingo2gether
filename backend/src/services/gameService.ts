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
        // Use a more efficient query pattern:
        // 1. Try to get existing game first
        // 2. Use updateMany with where clause that checks userId
        // 3. If no rows affected, create new game
        // This avoids the need to fetch the game ID separately
        
        const updateResult = await prisma.game.updateMany({
            where: { userId },
            data: {
                state,
                isSetup: state.isSetup || false,
                lastPlayedAt: new Date(),
            },
        });

        if (updateResult.count > 0) {
            // Game was updated, fetch and return it
            return prisma.game.findFirst({
                where: { userId },
                orderBy: { updatedAt: 'desc' },
            });
        }

        // No existing game, create a new one
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
