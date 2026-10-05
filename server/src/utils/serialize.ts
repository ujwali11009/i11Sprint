import type { User } from '@prisma/client';

export const toPublicUser = (user: User) => {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
};
