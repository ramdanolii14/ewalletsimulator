"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Cek apakah user sudah login
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/"); // redirect kalau sudah login
      }
    };
    checkSession();
  }, [router]);

  const handleLoginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://ewallet.ramdan.fun/auth/callback", // ini HARUS sama dengan yang didaftarkan di Google Console
      },
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center space-y-4">
        <h1 className="text-xl font-semibold">Login ke eWallet</h1>
        <button
          onClick={handleLoginWithGoogle}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Login dengan Google
        </button>
      </div>
    </main>
  );
}
