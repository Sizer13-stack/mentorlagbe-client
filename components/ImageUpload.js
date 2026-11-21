"use client";
import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Direct file upload to the ImgBB API (key comes from NEXT_PUBLIC_IMGBB_API_KEY)
export default function ImageUpload({ value, onChange, label = "Upload image", round, hint }) {
  const ref = useRef(null);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be smaller than 5 MB");
    const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!key) return toast.error("ImgBB API key is missing (NEXT_PUBLIC_IMGBB_API_KEY)");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: fd });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "Upload failed");
      onChange(json.data.display_url || json.data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message || "Image upload failed");
    } finally {
      setLoading(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className={`grid shrink-0 place-items-center overflow-hidden border border-dashed border-base-300 bg-base-200 ${round ? "h-24 w-24 rounded-full" : "h-24 w-40 rounded-xl"}`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          ) : loading ? <Loader2 className="animate-spin" /> : <ImagePlus className="opacity-40" />}
        </div>
        <div>
          <input ref={ref} type="file" accept="image/*" onChange={handle} className="hidden" />
          <button type="button" onClick={() => ref.current?.click()} disabled={loading} className="btn btn-outline btn-sm">
            {loading && <span className="loading loading-spinner loading-xs" />} {label}
          </button>
          <p className="mt-2 text-xs opacity-60">{hint || "JPG, PNG or WebP, up to 5 MB."}</p>
        </div>
      </div>
    </div>
  );
}
