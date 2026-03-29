import type { Role } from '@prisma/client';

export interface IJwtPayload {
  id: string;
  role: Role;
}
