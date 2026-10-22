import { IJwtPayload } from '@/common/interfaces';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}
