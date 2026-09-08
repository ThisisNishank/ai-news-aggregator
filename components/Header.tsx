"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bookmark,
  Menu,
  Newspaper,
  Search,
  User,
} from "lucide-react";

const categories = [
  { name: "Home", href: "/" },
  {
    name: "Technology",
    href: "/?category=technology",
    value: "technology",
  },
  {
    name: "Business",
    href: "/?category=business",
    value: "business",
  },
  {
    name: "Sports",
    href: "/?category=sports",
    value: "sports",
  },
  {
    name: "Science",
    href: "/?category=science",
    value: "science",
  },
];

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const currentQuery = searchParams.get("q") ?? "";

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = formData.get("query")?.toString().trim();

    if (!query) {
      router.push("/");
      return;
    }

    router.push(`/?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:-rotate-3 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-blue-500/30">
              <Newspaper className="h-5 w-5" />
            </div>

            <div>
              <span className="block text-xl font-bold tracking-tight text-slate-900">
                NewsHub
              </span>

              <span className="hidden text-[10px] font-medium tracking-wide text-slate-400 sm:block">
                NEWS SMARTER. LIVE BETTER.
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {categories.map((category) => {
              const isActive = category.value
                ? activeCategory === category.value
                : !activeCategory && !currentQuery;

              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className={`group relative rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-blue-600"
                      : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {category.name}

                  <span
                    className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 ${
                      isActive ? "w-6" : "w-0 group-hover:w-6"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById("news-search")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group rounded-xl p-2.5 text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
              aria-label="Search"
            >
              <Search className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
            </button>

            <button
              type="button"
              className="hidden rounded-xl p-2.5 text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 sm:block"
              aria-label="Saved articles"
            >
              <Bookmark className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
            </button>

            <button
              type="button"
              className="hidden rounded-xl p-2.5 text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 sm:block"
              aria-label="Profile"
            >
              <User className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
            </button>

            <button
              type="button"
              className="rounded-xl p-2.5 text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          id="news-search"
          className="flex justify-center border-t border-slate-100 py-3"
        >
          <div className="w-full max-w-2xl">
            <form
              onSubmit={handleSearch}
              className="group flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1.5 transition-all duration-300 focus-within:border-blue-300 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-500/10"
            >
              <Search className="ml-3 h-4 w-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-blue-500" />

              <input
                name="query"
                type="text"
                defaultValue={currentQuery}
                placeholder="Search for news, topics, or stories..."
                className="h-10 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                aria-label="Search news"
              />

              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}