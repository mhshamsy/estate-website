'use client';

import { Button } from '@/components/ui/button';
import { logoutAction } from './actions';

const LogoutButton = () => {
  return (
    <Button
      size="sm"
      variant="outline"
      className="text-red-600"
      onClick={async () => {
        await logoutAction();
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;

// components/logout-button.tsx
/*'use client'

import { logout } from "./actions"

export default function LogoutButton() {
  return (
    <button onClick={() => logout()}>
      خروج
    </button>
  )
}
  */
