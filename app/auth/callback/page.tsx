"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const { error } = await supabase.auth.getSession(); // optional: bisa refresh session

      if (error) {
        alert("Gagal login: " + error.message);
      } else {
        router.push("/dashboard"); // ganti dengan halaman utama kamu
      }
    };

    handleOAuthRedirect();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>Memproses login...</p>
    </main>
  );
}
