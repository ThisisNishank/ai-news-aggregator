"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import { NewsArticle } from "@/types/news";

export default function Home() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

useEffect(() => {
  async function loadNews() {
    setSearchError("");

    try {
      const endpoint = category
        ? `/api/news/search?category=${encodeURIComponent(category)}`
        : "/api/news/search";

      const response = await fetch(endpoint);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load news");
      }

      setArticles(data.articles);
    } catch {
      setArticles([]);
      setSearchError("Unable to load news right now. Please try again.");
    }
  }

  loadNews();
}, [category]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      const response = await fetch(
        `/api/news/search?q=${encodeURIComponent(query)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to search news");
      }

      setArticles(data.articles);
    } catch {
      setArticles([]);
      setSearchError("Unable to search news right now. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-muted px-3 py-1 text-sm font-medium">
            AI-Powered News
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Stay informed.
            <br />
            <span className="text-primary">Understand more.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Discover the latest news from trusted sources, summarized and
            organized with the help of AI.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-2xl items-center rounded-xl border bg-background p-2 shadow-sm"
          >
            <Search className="ml-3 h-5 w-5 text-muted-foreground" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search for news..."
              className="h-11 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
            />

            <button
              type="submit"
              disabled={isSearching}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        <div className="mt-20">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
            <h2 className="text-2xl font-bold">
  {searchQuery.trim()
    ? "Search Results"
    : category
      ? `${category.charAt(0).toUpperCase()}${category.slice(1)} News`
      : "Latest News"}
</h2>

              <p className="mt-1 text-sm text-muted-foreground">
               {searchQuery.trim()
                ? `News results for "${searchQuery.trim()}"`
                : category
                ? `Latest ${category} news`
                : "The latest stories from around the world"}
              </p>
            </div>
          </div>

          {searchError && (
            <p className="mt-8 text-center text-sm text-destructive">
              {searchError}
            </p>
          )}

          {!searchError && articles.length === 0 && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Search for a topic to discover news.
            </p>
          )}

          {articles.length > 0 && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, 6).map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="mt-16 border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p className="font-medium text-foreground">NewsHub</p>

          <p>
            AI-powered news aggregation built with Next.js and TypeScript.
          </p>
        </div>
      </footer>
    </main>
  );
}