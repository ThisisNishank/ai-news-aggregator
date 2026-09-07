"use client";

import Image from "next/image";
import { useState } from "react";
import { NewsArticle } from "@/types/news";


type NewsCardProps = {
  article: NewsArticle;
};

export default function NewsCard({ article }: NewsCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="flex h-[420px] flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      {article.imageUrl && !imageError ? (
    <Image
     src={article.imageUrl}
     alt={article.title}
     width={640}
     height={360}
     className="h-40 w-full object-cover"
     onError={() => setImageError(true)}
/>
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-muted text-sm text-muted-foreground">
          No image available
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          {article.category}
        </p>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 line-clamp-2 block text-lg font-semibold hover:underline"
        >
          {article.title}
        </a>

        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {article.description}
        </p>
      </div>
    </article>
  );
}