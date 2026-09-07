"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Bookmark,
  Menu,
  Newspaper,
  Search,
  User,
} from "lucide-react";

const categories = [
  { name: "Home", href: "/" },
  { name: "Technology", href: "/?category=technology", value: "technology" },
  { name: "Business", href: "/?category=business", value: "business" },
  { name: "Sports", href: "/?category=sports", value: "sports" },
  { name: "Science", href: "/?category=science", value: "science" },
];

export default function Header() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all duration-300 group-hover:-rotate-3 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20">
            <Newspaper className="h-5 w-5" />
          </div>

          <span className="text-xl font-bold tracking-tight transition-colors duration-200 group-hover:text-primary">
            NewsHub
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {categories.map((category) => {
            const isActive = category.value
              ? activeCategory === category.value
              : !activeCategory;

            return (
              <Link
                key={category.name}
                href={category.href}
                className={`group relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                {category.name}

                <span
                  className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 ${
                    isActive
                      ? "w-5"
                      : "w-0 group-hover:w-5"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="group rounded-xl p-2.5 transition-all duration-200 hover:bg-primary/10 hover:text-primary"
            aria-label="Search"
          >
            <Search className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          </button>

          <button
            type="button"
            className="hidden rounded-xl p-2.5 transition-all duration-200 hover:bg-primary/10 hover:text-primary sm:block"
            aria-label="Saved articles"
          >
            <Bookmark className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
          </button>

          <button
            type="button"
            className="hidden rounded-xl p-2.5 transition-all duration-200 hover:bg-primary/10 hover:text-primary sm:block"
            aria-label="Profile"
          >
            <User className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
          </button>

          <button
            type="button"
            className="rounded-xl p-2.5 transition-all duration-200 hover:bg-primary/10 hover:text-primary md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}