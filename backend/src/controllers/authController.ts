import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const result = await AuthService.register(email, password, name);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const result = await AuthService.login(email, password);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    static async me(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];
            const user = await AuthService.verifyToken(token);

            if (!user) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            res.json({
                id: user.id,
                email: user.email,
                name: user.name,
                isPro: user.isPro,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async googleLogin(req: Request, res: Response) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ error: 'Google Token is required' });
            }

            const result = await AuthService.googleAuth(token);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
