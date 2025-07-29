"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return router.replace("/");
      }

      setUserId(user.id);
    };

    fetchUser();
  }, [router]);

  const handleSubmit = async () => {
    if (!username.trim()) return alert("Username wajib diisi");

    setLoading(true);

    let avatar_url = null;

    if (avatarFile && userId) {
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`public/${userId}`, avatarFile, {
          upsert: true,
        });

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(data.path);
        avatar_url = urlData.publicUrl;
      }
    }

    // Update ke table `profiles`
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username,
        ...(avatar_url ? { avatar_url } : {}),
      })
      .eq("id", userId);

    setLoading(false);

    if (updateError) {
      alert("Gagal menyimpan profil");
    } else {
      router.replace(`/profile/${userId}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-4">
      <h1 className="text-xl font-bold mb-4">Lengkapi Profil Anda</h1>

      <label className="block mb-2">
        Username <span className="text-red-500">*</span>
      </label>
      <input
        className="w-full border p-2 mb-4"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <label className="block mb-2">Upload Avatar (opsional)</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Menyimpan..." : "Simpan Profil"}
      </button>
    </div>
  );
}
