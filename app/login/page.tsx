"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Jika sudah login, langsung ke halaman utama
        router.push("/");
      }
    });
  }, [supabase, router]);

  const handleGoogleLogin = async () => {
    const origin = location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`, // pastikan ini diizinkan di Supabase
      },
    });

    if (error) {
      alert("Login error: " + error.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-center">Login</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Login with Google
        </button>
      </div>
    </main>
  );
}
