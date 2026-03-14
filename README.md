# 🛒 GroceryGuru

A mobile-first grocery planning app. Select recipes, generate a deduplicated shopping list grouped by supermarket, swipe away items you already have, and share the list via WhatsApp.

Built for personal use by two people.

---

## Features

- **Recipe selection** — pick one or more recipes with checkboxes
- **Smart shopping list** — ingredients are deduplicated and grouped by supermarket (ALDI vs. alternative)
- **Swipe to remove** — remove items you already have at home (Framer Motion ready)
- **WhatsApp share** — one tap to share the formatted list
- **Manage ingredients** — add and edit ingredients with supermarket and aisle info
- **Add recipes** — create recipes with an ingredient multi-select and inline ingredient creation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| ORM | Drizzle ORM |
| Database | PostgreSQL (Supabase) |
| Animations | Framer Motion (stubbed, ready to wire up) |

---

## Project Structure

```
/app
  /recipes          # Recipe selection page
  /shopping-list    # Generated shopping list
  /add-recipe       # Add a new recipe
  /ingredients      # Manage ingredients
  /api
    /recipes        # GET, POST
    /ingredients    # GET, POST
    /ingredients/[id] # PATCH
    /shopping-list  # GET ?recipes=ID1,ID2

/components
  RecipeList.tsx
  ShoppingList.tsx
  IngredientItem.tsx
  IngredientForm.tsx

/lib
  db.ts             # Drizzle + postgres client
  queries.ts        # All DB queries
  whatsapp.ts       # Message builder + share URL

/drizzle
  schema.ts         # DB schema, relations, types
  migrations/       # Generated SQL migrations
```

---

## Database Schema

```
recipes
  id          uuid  PK
  name        text
  created_at  timestamp

ingredients
  id                      uuid  PK
  name                    text  UNIQUE
  group                   text
  at_aldi                 boolean
  location                integer
  alternative_supermarket text

recipe_ingredients
  recipe_id      uuid  FK → recipes.id
  ingredient_id  uuid  FK → ingredients.id
```

Supermarket logic: `at_aldi = true` → **ALDI**, otherwise → `alternative_supermarket`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/your-username/grocery-guru.git
cd grocery-guru
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase connection string:

```
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-[region].pooler.supabase.com:6543/postgres
```

> Get this from your Supabase project: **Settings → Database → Connection String (URI)**
> Use port `6543` (transaction pooler). Special characters in the password must be URL-encoded.

### 3. Run migrations

```bash
npm run db:generate   # generate SQL from schema
npm run db:migrate    # apply to database
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate SQL migrations from schema |
| `npm run db:migrate` | Apply migrations to database |
| `npm run db:push` | Push schema directly (no migration files) |
| `npm run db:studio` | Open Drizzle Studio (DB browser) |

---

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add `DATABASE_URL` in **Project Settings → Environment Variables**
4. Deploy

The app will be available at `your-project.vercel.app`. On mobile, use **Add to Home Screen** in Safari or Chrome to install it as a PWA-like icon.

---

## Roadmap

- [ ] Swipe-to-remove with Framer Motion
- [ ] Edit existing recipes
- [ ] Delete recipes / ingredients
- [ ] Quantity and unit support per ingredient
- [ ] PWA manifest for full home screen install
