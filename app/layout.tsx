import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "GroceryGuru",
  description: "Generate shopping lists from your favourite recipes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-lg min-h-screen flex flex-col">
          {/* Nav */}
          <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 py-3">
            <h1 className="text-lg font-bold tracking-tight">🛒 GroceryGuru</h1>
          </header>

          {/* Page content */}
          <main className="flex-1 px-4 py-6">{children}</main>

          {/* Bottom nav */}
          <nav className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
            <div className="flex">
              <a
                href="/recipes"
                className="flex-1 flex flex-col items-center py-3 text-xs gap-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                <span className="text-xl">📋</span>
                Recipes
              </a>
              <a
                href="/add-recipe"
                className="flex-1 flex flex-col items-center py-3 text-xs gap-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                <span className="text-xl">➕</span>
                Add Recipe
              </a>
              <a
                href="/ingredients"
                className="flex-1 flex flex-col items-center py-3 text-xs gap-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                <span className="text-xl">🥕</span>
                Ingredients
              </a>
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
