"use client";

type Props = {
  images?: string[];
  name: string;
};

export default function PlaceGallery({ images, name }: Props) {
  if (!images || images.length === 0) return null;
  const list = images.slice(0, 6);
  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      {list.map((src, idx) => (
        <div
          key={`${name}-img-${idx}`}
          className="gallery-item aspect-video overflow-hidden rounded-sm border border-neutral-800"
        >
          <img
            src={src}
            alt={`${name} photo ${idx + 1}`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              const wrapper = (e.currentTarget.closest(
                ".gallery-item"
              ) as HTMLElement | null);
              if (wrapper) wrapper.style.display = "none";
            }}
          />
        </div>
      ))}
    </div>
  );
}


