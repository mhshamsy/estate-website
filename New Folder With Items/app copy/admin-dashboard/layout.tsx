import React from 'react';

function Layout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-screen-lg px-4 py-10">{children}</div>;
}

export default Layout;
