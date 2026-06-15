"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader, Plus } from "lucide-react";
import Image from "next/image";

interface Props {
  values: string[];
  onChange: (urls: string[]) => void;
  token: string;
  folder?: string;
}

export default function MultiImageUpload({ values, onChange, token, folder = "new-global-tour-life" }: Props) {
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
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ image: base64, folder }),
        });
        const data = await res.json();
        if (data.url) onChange([...values, data.url]);
        else setError(data.error || "Upload failed");
        setUploading(false);
      };
    } catch {
      setError("Upload failed");
      setUploading(false);
    }
  }

  function remove(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
  }

  return (
    <div>
      {/* Image thumbnails */}
      {values.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          {values.map((url, i) => (
            <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-slate-600">
              <Image src={url} alt={`img-${i}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700"
              >
                <X size={12} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">Cover</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className="w-full h-20 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:border-[#01b7f2] transition-colors"
      >
        {uploading ? (
          <>
            <Loader size={18} className="text-[#01b7f2] animate-spin" />
            <span className="text-sm text-gray-400">Uploading...</span>
          </>
        ) : (
          <>
            <Plus size={18} className="text-gray-500" />
            <span className="text-sm text-gray-400">Add image</span>
            {values.length > 0 && <span className="text-xs text-gray-600">({values.length} uploaded)</span>}
          </>
        )}
      </div>
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
