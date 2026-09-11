"use client";

import { useState } from "react";
import { ArrowUpRight, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { NewsArticle } from "@/types/news";
import { authClient } from "@/lib/auth-client";

type NewsCardProps = {
  article: NewsArticle;
  initialSaved?: boolean;
  onRemove?: (articleId: string) => void;
};

export default function NewsCard({
  article,
  initialSaved = false,
  onRemove,
}: NewsCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const publishedDate = new Date(article.publishedAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  async function handleSave() {
    if (isPending || isSaving) {
      return;
    }

    if (!session) {
      router.push("/login");
      return;
    }

    setIsSaving(true);

    try {
      if (isSaved) {
        const response = await fetch(
          `/api/saved-articles?articleId=${encodeURIComponent(article.id)}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          throw new Error("Unable to remove article");
        }

        setIsSaved(false);
        onRemove?.(article.id);
      } else {
        const response = await fetch("/api/saved-articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(article),
        });

        if (!response.ok) {
          throw new Error("Unable to save article");
        }

        setIsSaved(true);
      }
    } catch {
      window.alert(
        isSaved
          ? "Unable to remove the article."
          : "Unable to save the article.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="group flex h-[420px] flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative h-40 shrink-0 overflow-hidden bg-muted">
        {article.imageUrl && !imageError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={article.imageUrl}
            alt={article.title}
            width={640}
            height={360}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image available
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          {article.category}
        </span>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          aria-label={isSaved ? "Remove saved article" : "Save article"}
          title={isSaved ? "Remove from saved articles" : "Save article"}
          className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 backdrop-blur-sm transition-all duration-200 ${
            isSaved
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-black/50 text-white hover:scale-105 hover:bg-white hover:text-blue-600"
          } ${isSaving ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <Bookmark
            className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="truncate font-medium">
            {article.source}
          </span>

          <span className="shrink-0">{publishedDate}</span>
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 line-clamp-2 text-lg font-bold leading-snug transition-colors duration-200 hover:text-primary"
        >
          {article.title}
        </a>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {article.description || "Read the full story to learn more."}
        </p>

        <div className="mt-auto pt-4">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-200 hover:gap-2.5"
          >
            Read article
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </article>
  );
}