// Mock Database for Development/Testing
// Simulates Prisma functionality without a real database

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface User {
  id: string;
  email: string;
  passwordHash: string | null;
  name: string | null;
  googleId: string | null;
  facebookId: string | null;
  isPro: boolean;
  proExpiresAt: Date | null;
  stripeCustomerId: string | null;
  mpCustomerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  id: string;
  userId: string;
  state: any;
  isSetup: boolean;
  lastPlayedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  keys: any;
  createdAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  provider: string;
  providerId: string;
  amount: number;
  currency: string;
  status: string;
  metadata: any | null;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
class MockPrisma {
  private users: Map<string, User> = new Map();
  private games: Map<string, Game> = new Map();
  private pushSubscriptions: Map<string, PushSubscription> = new Map();
  private payments: Map<string, Payment> = new Map();

  user = {
    create: async (data: any) => {
      const user: User = {
        id: generateUUID(),
        email: data.email,
        passwordHash: data.passwordHash || null,
        name: data.name || null,
        googleId: data.googleId || null,
        facebookId: data.facebookId || null,
        isPro: false,
        proExpiresAt: null,
        stripeCustomerId: null,
        mpCustomerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(user.id, user);
      return user;
    },

    findUnique: async (where: any) => {
      if (where.email) {
        return Array.from(this.users.values()).find(u => u.email === where.email) || null;
      }
      if (where.id) {
        return this.users.get(where.id) || null;
      }
      if (where.googleId) {
        return Array.from(this.users.values()).find(u => u.googleId === where.googleId) || null;
      }
      return null;
    },

    findFirst: async (where: any) => {
      return this.user.findUnique(where);
    },

    update: async (data: any) => {
      const user = this.users.get(data.where.id);
      if (!user) throw new Error('User not found');
      const updated = { ...user, ...data.data, updatedAt: new Date() };
      this.users.set(user.id, updated);
      return updated;
    },
  };

  game = {
    create: async (data: any) => {
      const game: Game = {
        id: generateUUID(),
        userId: data.data.userId,
        state: data.data.state,
        isSetup: data.data.isSetup,
        lastPlayedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.games.set(game.id, game);
      return game;
    },

    findUnique: async (where: any) => {
      return this.games.get(where.id) || null;
    },

    findFirst: async (where: any) => {
      return Array.from(this.games.values()).find((g: any) => {
        if (where.userId && g.userId !== where.userId) return false;
        return true;
      }) || null;
    },

    findMany: async (where: any) => {
      return Array.from(this.games.values()).filter((g: any) => {
        if (where.userId && g.userId !== where.userId) return false;
        return true;
      });
    },

    update: async (data: any) => {
      const game = this.games.get(data.where.id);
      if (!game) throw new Error('Game not found');
      const updated = { ...game, ...data.data, updatedAt: new Date() };
      this.games.set(game.id, updated);
      return updated;
    },

    deleteMany: async (where: any) => {
      const toDelete = Array.from(this.games.values()).filter((g: any) => {
        if (where.userId && g.userId !== where.userId) return false;
        return true;
      });
      toDelete.forEach(g => this.games.delete(g.id));
      return { count: toDelete.length };
    },
  };

  pushSubscription = {
    create: async (data: any) => {
      const sub: PushSubscription = {
        id: generateUUID(),
        userId: data.data.userId,
        endpoint: data.data.endpoint,
        keys: data.data.keys,
        createdAt: new Date(),
      };
      this.pushSubscriptions.set(sub.id, sub);
      return sub;
    },

    findFirst: async (where: any) => {
      return Array.from(this.pushSubscriptions.values()).find((s: any) => {
        if (where.endpoint && s.endpoint !== where.endpoint) return false;
        return true;
      }) || null;
    },

    findMany: async (where: any) => {
      return Array.from(this.pushSubscriptions.values()).filter((s: any) => {
        if (where.userId && s.userId !== where.userId) return false;
        return true;
      });
    },

    upsert: async (data: any) => {
      const existing = await this.pushSubscription.findFirst(data.where);
      if (existing) {
        return this.pushSubscriptions.get(existing.id)!;
      }
      return this.pushSubscription.create(data);
    },

    update: async (data: any) => {
      const sub = this.pushSubscriptions.get(data.where.id);
      if (!sub) throw new Error('PushSubscription not found');
      const updated = { ...sub, ...data.data };
      this.pushSubscriptions.set(sub.id, updated);
      return updated;
    },

    delete: async (where: any) => {
      const sub = this.pushSubscriptions.get(where.id);
      if (sub) this.pushSubscriptions.delete(where.id);
      return sub || null;
    },
  };

  payment = {
    create: async (data: any) => {
      const payment: Payment = {
        id: generateUUID(),
        userId: data.data.userId,
        provider: data.data.provider,
        providerId: data.data.providerId,
        amount: data.data.amount,
        currency: data.data.currency || 'BRL',
        status: data.data.status,
        metadata: data.data.metadata || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.payments.set(payment.id, payment);
      return payment;
    },

    findUnique: async (where: any) => {
      return this.payments.get(where.id) || null;
    },

    findFirst: async (where: any) => {
      return Array.from(this.payments.values()).find((p: any) => {
        if (where.providerId && p.providerId !== where.providerId) return false;
        if (where.userId && p.userId !== where.userId) return false;
        return true;
      }) || null;
    },

    findMany: async (where: any) => {
      return Array.from(this.payments.values()).filter((p: any) => {
        if (where.userId && p.userId !== where.userId) return false;
        return true;
      });
    },

    update: async (data: any) => {
      const payment = this.payments.get(data.where.id);
      if (!payment) throw new Error('Payment not found');
      const updated = { ...payment, ...data.data, updatedAt: new Date() };
      this.payments.set(payment.id, updated);
      return updated;
    },
  };

  $disconnect = async () => {
    // No-op
  };

  $transaction = async (callbacks: any) => {
    // Simple transaction simulation - just execute all callbacks
    if (Array.isArray(callbacks)) {
      return Promise.all(callbacks.map(cb => typeof cb === 'function' ? cb() : cb));
    }
    return callbacks;
  };
}

export const mockPrisma = new MockPrisma();
