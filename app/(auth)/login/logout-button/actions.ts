'use server';

import { signOut } from '@/lib/auth';

export const logoutAction = async () => {
  await signOut();
};

