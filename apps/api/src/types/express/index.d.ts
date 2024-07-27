import { User } from '../../models';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        isAdmin: boolean;
        role: string;
      };
    }
  }
}