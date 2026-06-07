// components/session-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Role } from '@/lib/types';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
}

interface SessionContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // خواندن token از cookie
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      try {
        const decoded = JSON.parse(atob(token));
        setUser({
          id: decoded.userId,
          name: decoded.name || null,
          email: decoded.email || null,
          role: decoded.role,
        });
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <SessionContext.Provider value={{ user, loading, logout }}>
      {children}
    </SessionContext.Provider>
  );
}
