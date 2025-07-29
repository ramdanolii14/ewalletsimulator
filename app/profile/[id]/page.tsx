"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/supabase/client";
import Image from "next/image";

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setSessionUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setUsername(data.username || "");
      setEmail(data.email);
      setBalance(data.balance);
      setAvatarUrl(data.avatar_url);
      setIsOwner(user.id === data.id);

      // Redirect ke halaman profile kalau user belum lengkapi profil
      if ((data.id === user.id) && (!data.username || !data.avatar_url)) {
        router.push(`/profile/${data.id}`);
      }
    };

    getProfile();
  }, [id, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const uploadAvatar = async () => {
    if (!file || !sessionUserId) return null;

    const fileExt = file.name.split(".").pop();
    const filePath = `${sessionUserId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSave = async () => {
    let avatar = avatarUrl;
    if (file) {
      const uploadedUrl = await uploadAvatar();
      if (uploadedUrl) avatar = uploadedUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username, avatar_url: avatar })
      .eq("id", sessionUserId);

    if (error) {
      alert("Gagal menyimpan perubahan");
      console.error(error);
    } else {
      alert("Perubahan berhasil disimpan");
      setAvatarUrl(avatar);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="text-center mb-6">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={100}
            height={100}
            className="rounded-full mx-auto"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto" />
        )}
        {isOwner && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2"
          />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Username</label>
          {isOwner ? (
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 rounded w-full"
            />
          ) : (
            <p>{username}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <p>{email}</p>
        </div>

        <div>
          <label className="block font-medium">Saldo</label>
          <p>{balance.toLocaleString()} coins</p>
        </div>

        {isOwner && (
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Simpan Perubahan
          </button>
        )}
      </div>
    </div>
  );
}
