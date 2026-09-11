"use client";

import { useEffect, useState } from "react";
import { Bookmark, Loader2, Newspaper } from "lucide-react";
import { useRouter } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import { authClient } from "@/lib/auth-client";
import { NewsArticle } from "@/types/news";

type SavedArticleResponse = {
  articleId: string;
  title: string;
  description: string;
  imageUrl?: string;
  source: string;
  publishedAt: string;
  url: string;
  category: string;
};

export default function SavedArticlesPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!session) {
      router.replace("/login");
      return;
    }

    async function loadSavedArticles() {
      try {
        const response = await fetch("/api/saved-articles");

        if (!response.ok) {
          throw new Error("Unable to fetch saved articles");
        }

        const data = await response.json();

        const formattedArticles: NewsArticle[] = data.articles.map(
          (article: SavedArticleResponse) => ({
            id: article.articleId,
            title: article.title,
            description: article.description,
            imageUrl: article.imageUrl ?? null,
            source: article.source,
            author: null,
            publishedAt: article.publishedAt,
            url: article.url,
            category: article.category,
          }),
        );

        setArticles(formattedArticles);
      } catch {
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadSavedArticles();
  }, [isPending, session, router]);

  if (isPending || isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bookmark className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Saved Articles
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Your personal collection of saved news.
            </p>
          </div>
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
           {articles.map((article) => (
       <NewsCard
       key={article.id}
       article={article}
       initialSaved
       onRemove={(articleId) => {
      setArticles((currentArticles) =>
        currentArticles.filter((item) => item.id !== articleId),
      );
      }}
    />
   ))}
          </div>
        ) : (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Newspaper className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No saved articles yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Save articles from the homepage and they will appear here for
              you.
            </p>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Explore news
            </button>
          </div>
        )}
      </section>
    </main>
  );
}