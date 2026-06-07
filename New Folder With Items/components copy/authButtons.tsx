'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar } from './ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import LogoutButton from '@/app/(auth)/login/logout-button';
import { Session } from 'next-auth';

type User = {
  role?: 'ADMIN' | 'USER';
  name?: string | null;
  email?: string | null;
  image?: string | null;
};
const AuthButtons = ({ user }: { user: Session["user"] | null }) => {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="text-sm tracking-widest uppercase hover:underline"
        >
          Login
        </Link>
        <div className="h-8 w-[1px] bg-white/50" />
        <Link
          href="/register"
          className="text-sm tracking-widest uppercase hover:underline"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="cursor-pointer">
            <Avatar>
              <Image
                src={user.image || "/avatarPic.png"}
                alt={`${user.name || user.email || "User"} avatar`}
                height={70}
                width={70}
                className="rounded-full object-cover"
              />
              <AvatarFallback className="text-sky-950">
                {(user.name || user.email)?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div>{user.name}</div>
            <div className="text-xs font-normal">{user.email}</div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/my-account">My Account</Link>
          </DropdownMenuItem>
          {user.role == "ADMIN" && (
            <DropdownMenuItem asChild>
              <Link href="/admin-dashboard">Admin Dashboard</Link>
            </DropdownMenuItem>
          )}
          {user.role == "USER" && (
            <DropdownMenuItem asChild>
              <Link href="/account/my-favourites">My Favourites</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />

          <DropdownMenuItem className="cursor-pointer text-red-600">
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AuthButtons;
