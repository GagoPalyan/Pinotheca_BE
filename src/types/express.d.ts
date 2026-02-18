import { IJwtPayload } from '../modules/auth/interfaces';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}
