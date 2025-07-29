"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function ProfileRedirectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirect = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          router.replace("/"); // atau arahkan ke halaman login
        } else {
          router.replace(`/profile/${user.id}`);
        }
      } catch (err) {
        console.error("Redirect error:", err);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    redirect();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-600">Mengarahkan ke halaman profil...</p>
    </div>
  );
}
