"use client";

import { useState } from "react";
import { ArrowUpRight, Bookmark, Sparkles, X } from "lucide-react";
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
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");

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

  async function handleGenerateSummary() {
    if (isGeneratingSummary) {
      return;
    }

    if (!session) {
      router.push("/login");
      return;
    }

    setIsSummaryOpen(true);
    setSummaryError("");

    if (summary) {
      return;
    }

    setIsGeneratingSummary(true);

    try {
      const response = await fetch("/api/ai/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate summary");
      }

      setSummary(data.summary ?? "");
    } catch {
      setSummaryError(
        "Unable to generate the AI summary right now. Please try again.",
      );
    } finally {
      setIsGeneratingSummary(false);
    }
  }

  return (
    <article className="group flex h-[420px] flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
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
          <span className="truncate font-medium">{article.source}</span>

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

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary transition-all hover:border-primary/40 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles
              className={`h-4 w-4 ${
                isGeneratingSummary ? "animate-pulse" : ""
              }`}
            />
            {isGeneratingSummary ? "Generating..." : "AI Summary"}
          </button>

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

      {isSummaryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <Sparkles className="h-4 w-4" />
                  AI Summary
                </div>

                <h3 className="mt-2 text-xl font-bold leading-snug text-slate-900">
                  {article.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsSummaryOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close AI summary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              {isGeneratingSummary ? (
                <div className="flex min-h-32 items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-sm text-slate-500">
                    <Sparkles className="h-7 w-7 animate-pulse text-blue-600" />
                    <p>Analyzing the available article information...</p>
                  </div>
                </div>
              ) : summaryError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {summaryError}
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                    {summary}
                  </p>
                </div>
              )}
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              AI summary generated from the available article title and
              description.
            </p>
          </div>
        </div>
      )}
    </article>
  );
}