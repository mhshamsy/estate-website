'use server';

import { signOut } from '@/lib/auth';

export const logoutAction = async () => {
  await signOut();
};

// app/(auth)/logout/actions.ts
/*'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
  redirect('/login')
}
*/
