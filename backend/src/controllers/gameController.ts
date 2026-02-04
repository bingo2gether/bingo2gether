import { Request, Response } from 'express';
import { GameService } from '../services/gameService.js';
import { AuthService } from '../services/authService.js';

export class GameController {
    private static async getUserIdFromRequest(req: Request) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

        const token = authHeader.split(' ')[1];
        const user = await AuthService.verifyToken(token);
        return user ? user.id : null;
    }

    static async getGame(req: Request, res: Response) {
        try {
            const userId = await GameController.getUserIdFromRequest(req);
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            const game = await GameService.getGameByUserId(userId);
            if (!game) return res.status(404).json({ error: 'Game not found' });

            res.json(game.state);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async syncGame(req: Request, res: Response) {
        try {
            const userId = await GameController.getUserIdFromRequest(req);
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            const { state } = req.body;
            if (!state) return res.status(400).json({ error: 'State is required' });

            const game = await GameService.saveGame(userId, state);
            res.json(game.state);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async reset(req: Request, res: Response) {
        try {
            const userId = await GameController.getUserIdFromRequest(req);
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            await GameService.resetGame(userId);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
