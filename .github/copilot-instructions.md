# AI Coding Assistant Instructions

## Tech Stack

- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS v3

## Backend

- Używaj Convex jako jedynego backendu (https://docs.convex.dev/)
- Używaj Convex mutations dla operacji zapisu
- Używaj Convex queries dla odczytu danych
- Convex actions dla integracji z zewnętrznymi API
- Definiuj schematy w `convex/schema.ts`
- Funkcje Convex w katalogu `convex/`

## Code Style

- Używaj funkcyjnych komponentów z TypeScript
- Preferuj Server Components (domyślnie)
- Client Components tylko gdy niezbędne (oznacz 'use client')

## Naming Conventions

- Komponenty: kebab-case (user-profile.tsx -> UserProfile)

## File Structure

- Komponenty w `components/`
- API routes w `app/api/`
- Server actions w `actions/`
- Types w `types/` lub obok komponentów

## Best Practices

- Zawsze dodawaj TypeScript types
- Unikaj 'any' - używaj proper typing
- Komponenty max 200 linii - split if larger
- Extract reusable logic do custom hooks

## Formatting

- Import order: React → Next.js → External → Internal → Types
- Jednoliniowe `if` bez nawiasów klamrowych:
  ```typescript
  // ✅ Dobrze
  if (condition) throw new Error("message");
  
  // ❌ Źle
  if (condition) {
    throw new Error("message");
  }
  ```
