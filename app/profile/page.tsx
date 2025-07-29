// app/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Dropzone from "react-dropzone";
import imageCompression from "browser-image-compression";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newUsername, setNewUsername] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/");
      setSessionUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, email, avatar_url, balance")
        .eq("id", user.id)
        .single();

      if (error) console.error(error);
      else {
        setProfile(data);
        setNewUsername(data.username);
      }
      setLoading(false);
    };
    getProfile();
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const compressed = await imageCompression(file, { maxSizeMB: 0.5 });
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filename, compressed, { upsert: true });

    if (uploadError) {
      alert("Upload gagal");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filename);
    const publicUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", sessionUserId);

    if (!updateError) setProfile({ ...profile, avatar_url: publicUrl });
    setUploading(false);
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ username: newUsername })
      .eq("id", sessionUserId);

    if (!error) {
      setProfile({ ...profile, username: newUsername });
      alert("Profil berhasil diperbarui");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  const isOwner = profile?.id === sessionUserId;

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex flex-col items-center mb-6">
        <Image
          src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.username}`}
          alt="Avatar"
          width={96}
          height={96}
          className="rounded-full mb-4"
        />
        {isOwner && (
          <Dropzone onDrop={(acceptedFiles) => handleUpload(acceptedFiles[0])}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="cursor-pointer px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                <input {...getInputProps()} />
                {uploading ? "Mengupload..." : "Ganti Avatar"}
              </div>
            )}
          </Dropzone>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Username</label>
        {isOwner ? (
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full border p-2 rounded"
          />
        ) : (
          <p>{profile.username}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <p>{profile.email}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Balance</label>
        <p>Rp {profile.balance.toLocaleString()}</p>
      </div>
      {isOwner && (
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Simpan Perubahan
        </button>
      )}
    </div>
  );
}
