"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  balance: number;
}

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setProfile(data);
        setNewUsername(data.username);
        setIsOwner(user?.id === data.id);
      }
    };

    fetchProfile();
  }, [id]);

  const handleUpdate = async () => {
    if (!profile) return;

    let avatar_url = profile.avatar_url;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile, {
          upsert: true,
        });

      if (!uploadError) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
        avatar_url = data.publicUrl;
      } else {
        console.error("Upload error:", uploadError);
        alert("Gagal upload avatar.");
        return;
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username: newUsername, avatar_url })
      .eq("id", profile.id);

    if (!error) {
      setProfile((prev) =>
        prev ? { ...prev, username: newUsername, avatar_url } : prev
      );
      alert("Profil berhasil diperbarui!");
    } else {
      alert("Gagal memperbarui profil.");
    }
  };

  if (!profile) return <p className="text-center mt-8">Memuat profil...</p>;

  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    profile.username
  )}&background=random`;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center mb-6">
        <Image
          src={profile.avatar_url || avatarFallback}
          alt="Avatar"
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
        {isOwner && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setAvatarFile(file);
            }}
            className="mt-2"
          />
        )}
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Username</label>
        {isOwner ? (
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
        ) : (
          <p>{profile.username}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Email</label>
        <p>{profile.email}</p>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Saldo</label>
        <p>{profile.balance.toLocaleString()} coins</p>
      </div>

      {isOwner && (
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Simpan Perubahan
        </button>
      )}
    </div>
  );
}
