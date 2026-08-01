'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CATEGORIES, CONDITIONS, CURRENCY, STORAGE_BUCKET } from '@/lib/constants';
import type { Listing } from '@/lib/types';
import { CameraIcon, UploadIcon } from './icons';

interface Props {
  initial?: Listing;
}

interface PhotoItem {
  id: string;
  file?: File;
  preview: string; // object URL for new files, or the stored URL for existing
  existingUrl?: string;
}

// Vinted-style "list an item" form: drop in photos, write a description, set a
// price, and it's live. Photos upload to Supabase Storage.
export function SellForm({ initial }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [photos, setPhotos] = useState<PhotoItem[]>(
    (initial?.images ?? []).map((url, i) => ({ id: `existing-${i}`, preview: url, existingUrl: url }))
  );
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [price, setPrice] = useState(initial?.price?.toString() ?? '');
  const [originalPrice, setOriginalPrice] = useState(initial?.original_price?.toString() ?? '');
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0].slug);
  const [subcategory, setSubcategory] = useState(initial?.subcategory ?? '');
  const [size, setSize] = useState(initial?.size ?? '');
  const [brand, setBrand] = useState(initial?.brand ?? '');
  const [color, setColor] = useState(initial?.color ?? '');
  const [condition, setCondition] = useState<string>(initial?.condition ?? 'Excellent');
  const [status, setStatus] = useState<string>(initial?.status ?? 'active');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeCat = CATEGORIES.find((c) => c.slug === category);

  function onCategoryChange(slug: string) {
    setCategory(slug);
    // Reset the audience when switching to a category without sub-departments.
    const cat = CATEGORIES.find((c) => c.slug === slug);
    if (!cat?.subcategories) setSubcategory('');
    else if (!cat.subcategories.some((s) => s.slug === subcategory)) setSubcategory('');
  }

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).slice(0, 8).map((file, i) => ({
      id: `new-${Date.now()}-${i}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((p) => [...p, ...next].slice(0, 8));
  }

  function removePhoto(id: string) {
    setPhotos((p) => p.filter((x) => x.id !== id));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError('The shop backend isn’t connected yet, so listings can’t be saved. Add your Supabase keys to go live.');
      return;
    }
    if (!photos.length) {
      setError('Please add at least one photo — good photos sell items!');
      return;
    }
    if (!title.trim() || !price) {
      setError('A title and a price are needed.');
      return;
    }

    setBusy(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?next=/sell');
        return;
      }

      const listingId = initial?.id ?? crypto.randomUUID();

      // Upload any new photos, keep existing ones in order.
      const urls: string[] = [];
      for (let i = 0; i < photos.length; i++) {
        const p = photos[i];
        if (p.existingUrl && !p.file) {
          urls.push(p.existingUrl);
          continue;
        }
        if (!p.file) continue;
        const ext = p.file.name.split('.').pop() || 'jpg';
        const path = `${listingId}/${i}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(path, p.file, { upsert: true, cacheControl: '3600' });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        urls.push(pub.publicUrl);
      }

      const payload = {
        id: listingId,
        seller_id: user.id,
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        original_price: originalPrice ? Number(originalPrice) : null,
        currency: CURRENCY,
        category,
        subcategory: activeCat?.subcategories ? subcategory || null : null,
        size: size.trim() || null,
        brand: brand.trim() || null,
        color: color.trim() || null,
        condition,
        status,
      };

      const { error: upsertErr } = await supabase.from('listings').upsert(payload);
      if (upsertErr) throw upsertErr;

      // Reset images then re-insert in order.
      await supabase.from('listing_images').delete().eq('listing_id', listingId);
      const imageRows = urls.map((url, position) => ({ listing_id: listingId, url, position }));
      if (imageRows.length) {
        const { error: imgErr } = await supabase.from('listing_images').insert(imageRows);
        if (imgErr) throw imgErr;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong saving your listing.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Photos */}
      <section className="card p-5">
        <h2 className="label">Photos <span className="font-normal text-plum/40">· up to 8 · first is the cover</span></h2>

        {photos.length > 0 && (
          <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.map((p, i) => (
              <div key={p.id} className="relative aspect-square overflow-hidden rounded-2xl bg-midg-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt="" className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute left-1 top-1 rounded-full bg-midg-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(p.id)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-plum shadow"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {photos.length < 8 && (
          <div className="grid grid-cols-2 gap-3">
            {/* Opens the phone's rear camera on mobile; a file picker on desktop. */}
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl bg-midg-500 py-5 text-white shadow-soft transition active:scale-[0.98]">
              <CameraIcon width={26} height={26} />
              <span className="text-sm font-semibold">Take photo</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-midg-200 py-5 text-midg-500 transition hover:bg-midg-50">
              <UploadIcon width={26} height={26} />
              <span className="text-sm font-semibold">Upload photos</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </label>
          </div>
        )}
        <p className="mt-2 text-xs text-plum/45">
          Tip: natural daylight and a plain background make items sell faster. 📸
        </p>
      </section>

      {/* Details */}
      <section className="card space-y-4 p-5">
        <div>
          <label className="label" htmlFor="title">Title</label>
          <input id="title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Vintage floral tea dress" required />
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="input min-h-[120px] resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the fit, fabric, any flaws, and why you love it. Honest detail builds trust and sells faster!"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="price">Price (£)</label>
            <input id="price" type="number" min="0" step="0.01" className="input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="24" required />
          </div>
          <div>
            <label className="label" htmlFor="original">Was (£) <span className="font-normal text-plum/40">optional</span></label>
            <input id="original" type="number" min="0" step="0.01" className="input" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="40" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="category">Category</label>
            <select id="category" className="input" value={category} onChange={(e) => onCategoryChange(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="condition">Condition</label>
            <select id="condition" className="input" value={condition} onChange={(e) => setCondition(e.target.value)}>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {activeCat?.subcategories && (
          <div>
            <label className="label" htmlFor="audience">Who’s it for?</label>
            <select
              id="audience"
              className="input"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            >
              <option value="">Select…</option>
              {activeCat.subcategories.map((s) => (
                <option key={s.slug} value={s.slug}>{s.emoji} {s.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label" htmlFor="brand">Brand</label>
            <input id="brand" className="input" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Zara" />
          </div>
          <div>
            <label className="label" htmlFor="size">Size</label>
            <input id="size" className="input" value={size} onChange={(e) => setSize(e.target.value)} placeholder="M / UK 6" />
          </div>
          <div>
            <label className="label" htmlFor="color">Colour</label>
            <input id="color" className="input" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Pink" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="status">Availability</label>
          <select id="status" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </section>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-20 z-20 flex gap-3 md:bottom-4">
        <button type="submit" disabled={busy} className="btn-primary flex-1 shadow-soft">
          {busy ? 'Saving…' : initial ? 'Save changes' : 'List item ✨'}
        </button>
      </div>
    </form>
  );
}
