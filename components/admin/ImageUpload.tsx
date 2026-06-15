"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader } from "lucide-react";
import Image from "next/image";

interface Props {
  value: string;
  onChange: (url: string) => void;
  token: string;
  folder?: string;
}

export default function ImageUpload({ value, onChange, token, folder = "new-global-tour-life" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: base64, folder }),
        });
        const data = await res.json();
        if (data.url) {
          onChange(data.url);
        } else {
          setError(data.error || "Upload failed");
        }
        setUploading(false);
      };
    } catch {
      setError("Upload failed");
      setUploading(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-600">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#01b7f2] transition-colors"
        >
          {uploading ? (
            <>
              <Loader size={24} className="text-[#01b7f2] animate-spin mb-2" />
              <span className="text-sm text-gray-400">Uploading to Cloudinary...</span>
            </>
          ) : (
            <>
              <Upload size={24} className="text-gray-500 mb-2" />
              <span className="text-sm text-gray-400">Click to upload image</span>
              <span className="text-xs text-gray-600 mt-1">PNG, JPG, WEBP up to 10MB</span>
            </>
          )}
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
