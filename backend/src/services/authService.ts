import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { User } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export class AuthService {
    static async register(email: string, password: string, name?: string) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
            },
        });

        return this.generateToken(user);
    }

    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        return this.generateToken(user);
    }

    static async googleAuth(token: string) {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error('Invalid Google Token');
        }

        const { email, name, sub: googleId } = payload;

        if (!email) {
            throw new Error('Email not provided in Google Token');
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            // Update googleId if not present
            if (!user.googleId && googleId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId }
                });
            }
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || 'Usuário Google',
                    googleId,
                    isPro: false
                }
            });
        }

        if (!user) throw new Error('Failed to authenticate user');
        return this.generateToken(user);
    }

    static generateToken(user: User) {
        const payload = {
            id: user.id,
            email: user.email,
            isPro: user.isPro,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isPro: user.isPro,
            },
        };
    }

    static async verifyToken(token: string) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            const user = await prisma.user.findUnique({ where: { id: decoded.id } });
            return user;
        } catch {
            return null;
        }
    }
}
