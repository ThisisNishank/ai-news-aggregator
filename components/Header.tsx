import {
  Bookmark,
  Menu,
  Newspaper,
  Search,
  User,
} from "lucide-react";

export default function Header() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Newspaper className="h-5 w-5" />
          </div>

          <span className="text-xl font-bold tracking-tight">
            NewsHub
          </span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </a>

          <a
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Technology
          </a>

          <a
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Business
          </a>

          <a
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Sports
          </a>

          <a
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Science
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg p-2 transition-colors hover:bg-muted"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="hidden rounded-lg p-2 transition-colors hover:bg-muted sm:block"
            aria-label="Saved articles"
          >
            <Bookmark className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="hidden rounded-lg p-2 transition-colors hover:bg-muted sm:block"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 transition-colors hover:bg-muted md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}