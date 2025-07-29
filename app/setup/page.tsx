"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";

export default function SetupProfile() {
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !username || !avatarFile) return;

    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, {
        upsert: true,
      });

    if (uploadError) {
      alert("Gagal upload avatar");
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username,
        avatar_url: filePath,
      })
      .eq("id", user.id);

    if (updateError) {
      alert("Gagal update profil");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Lengkapi Profil Anda</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Username</label>
        <input
          className="w-full border px-3 py-2 mb-4"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label className="block mb-2 font-medium">Avatar</label>
        <input
          className="w-full mb-4"
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
