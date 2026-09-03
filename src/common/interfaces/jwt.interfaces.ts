import type { Role } from '@prisma/client';

interface IJwtPayload {
  id: string;
  role: Role;
}

export type { IJwtPayload };
