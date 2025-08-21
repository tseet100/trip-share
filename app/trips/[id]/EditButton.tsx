"use client";

import { useEffect, useState } from "react";

export default function EditButton({ id }: { id: string }) {
  const [canEdit, setCanEdit] = useState<boolean | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`/api/trips/${id}`);
        const data = await res.json();
        if (!ignore) setCanEdit(Boolean(data?.canEdit));
      } catch {
        if (!ignore) setCanEdit(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (!canEdit) return null;
  return (
    <div className="mb-4 text-right">
      <a href={`/trips/${id}/edit`} className="text-xs text-blue-400 hover:underline">Edit trip</a>
    </div>
  );
}


