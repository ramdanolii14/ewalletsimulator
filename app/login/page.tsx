"use client";

import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      alert("Login gagal: " + error.message);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4 text-center">
        <h1 className="text-xl font-semibold">Login</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
        >
          Login dengan Google
        </button>
      </div>
    </main>
  );
}
