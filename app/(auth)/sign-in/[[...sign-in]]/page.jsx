// app/(auth)/sign-in/page.jsx  OR  pages/sign-in.jsx
"use client"; // only if you're using App Router!

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back 👋</h1>
          <p className="text-sm text-gray-600">Sign in to continue</p>
        </div>
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded",
              card: "shadow-none",
            },
          }}
        />
      </div>
    </div>
  );
}
