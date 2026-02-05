import { Request, Response } from 'express';
import { GameService } from '../services/gameService.js';

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
        isPro: boolean;
    };
}

export class GameController {
    static async getGame(req: Request, res: Response) {
        try {
            // User is already authenticated by middleware
            const userId = (req as AuthenticatedRequest).user.id;

            const game = await GameService.getGameByUserId(userId);
            if (!game) return res.status(404).json({ error: 'Game not found' });

            res.json(game.state);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async syncGame(req: Request, res: Response) {
        try {
            // User is already authenticated by middleware
            const userId = (req as AuthenticatedRequest).user.id;

            const { state } = req.body;
            if (!state) return res.status(400).json({ error: 'State is required' });

            await GameService.saveGame(userId, state);
            // Return the state that was just saved instead of fetching from DB
            res.json(state);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async reset(req: Request, res: Response) {
        try {
            // User is already authenticated by middleware
            const userId = (req as AuthenticatedRequest).user.id;

            await GameService.resetGame(userId);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
