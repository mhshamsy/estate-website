'use client'

import Link from 'next/link';

const NotAuthButtons = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="tracking-widest uppercase hover:underline">
        <Link href={'/login'}>Login</Link>
      </div>

      <div className="h-8 w-[1px] bg-white/50" />
      <div className="tracking-widest uppercase hover:underline">
        <Link href={'/register'}>SignUp</Link>
      </div>
    </div>
  );
};

export default NotAuthButtons;
