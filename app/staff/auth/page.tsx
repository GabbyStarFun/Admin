'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignInButton, SignedIn, SignedOut, useAuth } from '@clerk/nextjs';

export default function SignInPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams(); // Get the search parameters

  // Redirect if the user is already signed in
  useEffect(() => {
    if (isSignedIn) {
      const callback = searchParams.get('callback'); // Get the callback parameter
      if (callback) {
        router.push(callback); // Redirect to the callback URL
      } else {
        router.push('/staff/home'); // Default redirect
      }
    }
  }, [isSignedIn, router, searchParams]); // Dependencies properly declared

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-lime-900 to-lime-950">
        <div className="max-w-md w-full bg-lime-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-lime-300 mb-4">Log in to LimeRadio</h1>

          <SignedIn>
            <p className="text-lime-400">
              Redirecting to {searchParams.get('callback') || "/staff/home"}
            </p>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              Log in.
            </SignInButton>
            <AutoSignIn />
          </SignedOut>
        </div>
      </div>
    </Suspense>
  );
}

function AutoSignIn() {
  useEffect(() => {
    const signInButton = document.getElementById('auto-sign-in');
    signInButton?.click(); // Automatically trigger the sign-in button click
  }, []);

  return (
    <button
      id="auto-sign-in"
      style={{ display: 'none' }} // Hide the button
    >
      Sign In
    </button>
  );
}
