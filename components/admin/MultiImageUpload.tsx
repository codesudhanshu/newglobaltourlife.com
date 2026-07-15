"use client";

import { useState, useRef } from "react";
import { X, Loader, Plus } from "lucide-react";
import Image from "next/image";

interface Props {
  values: string[];
  onChange: (urls: string[]) => void;
  token: string;
  folder?: string;
  // Optional per-image alt text (SEO). When onAltsChange is provided, an alt
  // input is shown under each image and kept index-aligned with `values`.
  alts?: string[];
  onAltsChange?: (alts: string[]) => void;
}

export default function MultiImageUpload({ values, onChange, token, folder = "new-global-tour-life", alts = [], onAltsChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const withAlt = typeof onAltsChange === "function";

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
        if (data.url) {
          onChange([...values, data.url]);
          if (withAlt) onAltsChange!([...alts, ""]);
        } else setError(data.error || "Upload failed");
        setUploading(false);
      };
    } catch {
      setError("Upload failed");
      setUploading(false);
    }
  }

  function remove(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
    if (withAlt) onAltsChange!(alts.filter((_, i) => i !== idx));
  }

  function setAlt(idx: number, value: string) {
    const next = [...alts];
    next[idx] = value;
    onAltsChange!(next);
  }

  return (
    <div>
      {values.length > 0 && (
        <div className={`grid ${withAlt ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-3"} gap-3 mb-3`}>
          {values.map((url, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <div className="relative aspect-video">
                <Image src={url} alt={alts[i] || `img-${i}`} fill className="object-cover" />
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
              {withAlt && (
                <input
                  value={alts[i] || ""}
                  onChange={(e) => setAlt(i, e.target.value)}
                  placeholder="Alt text (SEO)"
                  className="w-full text-xs px-2 py-1.5 border-t border-gray-200 text-gray-700 focus:outline-none focus:bg-blue-50/40"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:border-[#01b7f2] transition-colors bg-gray-50"
      >
        {uploading ? (
          <>
            <Loader size={18} className="text-[#01b7f2] animate-spin" />
            <span className="text-sm text-gray-500">Uploading...</span>
          </>
        ) : (
          <>
            <Plus size={18} className="text-gray-400" />
            <span className="text-sm text-gray-500">Add image</span>
            {values.length > 0 && <span className="text-xs text-gray-400">({values.length} uploaded)</span>}
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
