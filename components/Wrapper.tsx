// components/ClientWrapper.tsx - Client Component for ClerkProvider

"use client"; // This marks the component as a client component

import { ClerkProvider } from '@clerk/nextjs';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {

  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}
