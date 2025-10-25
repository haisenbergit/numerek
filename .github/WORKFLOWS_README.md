# GitHub Workflows - Instrukcje

## Utworzone Workflows

### 1. **CI (ci.yml)** 🔄

Uruchamia się przy każdym push i pull request na **wszystkich branchach**.

**Sprawdza:**

- ✅ ESLint (błędy w kodzie)
- ✅ Prettier (formatowanie)
- ✅ TypeScript (typy)
- ✅ Build Next.js

**Wymagane secrets:**

- `NEXT_PUBLIC_CONVEX_URL` - URL do Convex

---

### 2. **Code Quality (code-quality.yml)** 📊

Uruchamia się przy **każdym pull request** (wszystkie branche).

**Sprawdza:**

- 🚫 `console.log` w kodzie produkcyjnym
- ⚠️ Nadmierne TODO/FIXME komentarze
- 📏 Rozmiar plików komponentów (max 200 linii)

---

### 3. **Convex Deployment (convex-deploy.yml)** 🚀

Uruchamia się przy zmianach w katalogu `convex/` na **wszystkich branchach**.

**Funkcje:**

- Walidacja Convex TypeScript (wszystkie branche)
- Sprawdzanie schema.ts
- Auto-deploy do Convex **tylko przy push do `master`**

**Wymagane secrets:**

- `CONVEX_DEPLOY_KEY` - klucz deploy z Convex Dashboard

---

### 4. **Dependencies (dependencies.yml)** 📦

Uruchamia się co poniedziałek o 9:00 UTC.

**Sprawdza:**

- Przestarzałe pakiety npm
- Luki bezpieczeństwa (npm audit)

---

## Konfiguracja Secrets

W GitHub repo → Settings → Secrets and variables → Actions, dodaj:

### Dla Convex:

1. **CONVEX_DEPLOY_KEY**
    - Wejdź na: https://dashboard.convex.dev
    - Settings → Deploy Keys → Generate new key
    - Skopiuj klucz

2. **NEXT_PUBLIC_CONVEX_URL**
    - Znajdziesz w `.env.local`
    - Przykład: `https://your-project.convex.cloud`

---

## Lokalne komendy

```bash
# Sprawdź formatowanie
npm run format:check

# Napraw formatowanie
npm run format

# Sprawdź ESLint
npm run lint

# Sprawdź TypeScript
npm run type-check

# Uruchom wszystko lokalnie przed PR
npm run validate
# lub ręcznie:
# npm run lint && npm run type-check && npm run format:check && npm run build
```

---

## Branch Protection Rules (Opcjonalnie)

Zalecane ustawienia dla brancha `master`:

1. Settings → Branches → Add rule
2. Branch name pattern: `master`
3. Zaznacz:
    - ✅ Require a pull request before merging
    - ✅ Require status checks to pass before merging
        - Wybierz: `Lint & Format Check`, `TypeScript Check`, `Build Next.js`
    - ✅ Require conversation resolution before merging

---

## Troubleshooting

### Build fails with Convex error

- Sprawdź czy `NEXT_PUBLIC_CONVEX_URL` jest dodany w secrets
- Upewnij się że URL kończy się bez `/`

### Prettier check fails

- Lokalnie uruchom: `npm run format`
- Commituj poprawione pliki

### TypeScript errors

- Lokalnie: `npm run type-check`
- Napraw błędy przed pushem

