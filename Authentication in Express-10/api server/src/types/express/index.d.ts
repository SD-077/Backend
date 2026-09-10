import type { Post } from '#models';
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roles: string[];
      };
    }
  }
}

export {};
