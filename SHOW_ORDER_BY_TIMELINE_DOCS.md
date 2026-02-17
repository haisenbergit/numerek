# Show Order by Timeline - Dokumentacja

## Opis

Moduł `show-order-by-timeline` wyświetla szczegóły i postęp realizacji zamówienia w formie timeline (osi czasu) oraz **circular progress** pokazującego upływ czasu. **Działa dokładnie tak samo jak `show-order`** - używa tego samego przepływu z `CodeInputModal` i routingu przez `[orderId]`.

## Struktura

```
src/app/show-order-by-timeline/
├── page.tsx                    # Modal z wprowadzaniem kodu (CodeInputModal)
└── [orderId]/
    └── page.tsx                # Strona szczegółów z timeline
```

## Routing

- `/show-order-by-timeline` - Modal do wprowadzenia kodu odbioru (3 znaki)
- `/show-order-by-timeline/[orderId]` - Szczegóły zamówienia (np. `/show-order-by-timeline/j57abc123`)

## Przepływ użytkownika

1. ✅ Użytkownik wchodzi na `/show-order-by-timeline`
2. 🎯 Widzi modal `CodeInputModal` z `InputOTP` (3 znaki)
3. ⌨️ Wprowadza kod zamówienia (np. "ABC")
4. 🔍 System sprawdza kod przez `useGetOrderByCode`
5. ✅ Jeśli zamówienie istnieje → przekierowanie do `/show-order-by-timeline/[orderId]`
6. ❌ Jeśli nie istnieje → toast z błędem i reset formularza

## Komponenty

### OrderTimeProgress (`/components/order-time-progress.tsx`)

**Nowy komponent** pokazujący postęp w upływie czasu między utworzeniem zamówienia a przewidywanym czasem odbioru.

**Funkcjonalność:**
- 🔵 Circular progress bar pokazujący procent upływu czasu
- ⏱️ Automatyczna aktualizacja co sekundę
- 📊 Dynamiczne obliczanie progresu: `(now - creationTime) / (orderTime - creationTime) * 100`
- 🔴 Kolor czerwony gdy termin minął
- 🟢 Kolor zielony gdy zamówienie jest w trakcie realizacji
- ⏰ Wyświetlanie pozostałego czasu w formacie:
  - `Xd Xh` - gdy pozostały dni
  - `Xh Xm` - gdy pozostały godziny
  - `Xm Xs` - gdy pozostały minuty
  - `Xs` - gdy pozostały sekundy
  - "Termin minął" - gdy czas upłynął

**Props:**
```typescript
interface OrderTimeProgressProps {
  creationTime: number;    // timestamp utworzenia (_creationTime)
  orderTime: number;       // timestamp przewidywanego odbioru
  size?: number;          // rozmiar koła (default: 120)
  thickness?: number;     // grubość linii (default: 8)
}
```

**Użycie w Timeline:**
- Pokazuje się tylko gdy `!order.isReady` (zamówienie jeszcze nie gotowe)
- Umieszczony między sekcją z kodem a historią zamówienia
- Używa `CircularProgressCombined` z UI components

### Strona główna (`page.tsx`)

**Używane komponenty:**
- `CodeInputModal` - Modal z `InputOTP` do wprowadzenia 3-znakowego kodu
- `Loader2` - Spinner podczas sprawdzania kodu

**Hooks:**
- `useGetOrderByCode(submittedCode)` - Pobiera zamówienie po kodzie
- `useRouter()` - Przekierowanie do `[orderId]`

**Funkcjonalność:**
- Progress bar (0-100%) pokazujący postęp wprowadzania
- Automatyczna konwersja na wielkie litery
- Przycisk aktywny tylko gdy kod ma 3 znaki
- Toast error gdy zamówienie nie zostanie znalezione
- Loader podczas sprawdzania kodu

### Strona szczegółów (`[orderId]/page.tsx`)

**Używane komponenty:**
- `Timeline` - Kontener główny osi czasu
- `TimelineItem` - Pojedynczy punkt na osi
- `TimelineDot` - Kropka/ikona punktu
- `TimelineConnector` - Linia łącząca punkty
- `TimelineContent` - Zawartość punktu
- `TimelineHeader` - Nagłówek punktu
- `TimelineTitle` - Tytuł punktu
- `TimelineDescription` - Opis punktu
- `TimelineTime` - Czas punktu

**Hooks:**
- `useOrderId()` - Pobiera orderId z URL
- `useGetOrderById(orderId)` - Pobiera dane zamówienia

## Timeline - 3 punkty w czasie

### 1️⃣ Utworzenie zamówienia
- **Czas**: `_creationTime` (automatyczny timestamp z Convex)
- **Status**: Zawsze `completed`
- **Ikona**: `Package` (primary)
- **Tytuł**: "Utworzenie zamówienia"
- **Opis**: "Zamówienie zostało zarejestrowane w systemie"

### 2️⃣ Odbiór zamówienia
- **Czas**: 
  - Szacowany: `orderTime`
  - Potwierdzony: `readyTime` (gdy `isReady === true`)
- **Status**: 
  - `completed` gdy `isReady === true`
  - `active` lub `pending` w przeciwnym razie
- **Ikona**: 
  - `CheckCircle` (primary) gdy gotowe
  - `Package` gdy oczekuje
- **Tytuł**:
  - "Zamówienie gotowe do odbioru" (gdy `isReady === true`)
  - "Oczekiwanie na realizację" (gdy oczekuje)
- **Opis**:
  - "Zamówienie zostało zrealizowane i jest gotowe" (gdy gotowe)
  - "Zamówienie jest w trakcie realizacji" (gdy oczekuje)

### 3️⃣ Zamknięcie zamówienia
- **Czas**: Brak konkretnego timestampu
- **Status**: 
  - `completed` gdy `isActive === false`
  - `pending` w przeciwnym razie
- **Ikona**: 
  - `XCircle` (primary) gdy zamknięte
  - `Package` gdy oczekuje
- **Tytuł**:
  - "Zamówienie zamknięte" (gdy `isActive === false`)
  - "Oczekiwanie na zamknięcie" (gdy aktywne)
- **Opis**:
  - "Zamówienie zostało odebrane i zamknięte" (gdy zamknięte)
  - "Zamówienie nie zostało jeszcze zamknięte" (gdy aktywne)

## Logika `activeIndex`

Timeline używa `activeIndex` do określenia aktualnego etapu zamówienia:

```typescript
const activeIndex = useMemo(() => {
  if (!order) return 0;
  if (!order.isActive) return 2;      // Zamknięte
  if (order.isReady) return 1;         // Gotowe
  return 0;                            // W realizacji
}, [order]);
```

- **activeIndex = 2**: Zamówienie zamknięte (wszystkie punkty completed)
- **activeIndex = 1**: Zamówienie gotowe (punkt 1 i 2 completed, punkt 3 pending)
- **activeIndex = 0**: W realizacji (punkt 1 completed, reszta pending/active)

## API

### Convex Queries

**`api.orders.getByCode`**
```typescript
// Używane w page.tsx
const { data: order, isLoading } = useGetOrderByCode(code);
```
- Wyszukuje zamówienie po kodzie
- Zwraca tylko aktywne zamówienia (`isActive === true`)

**`api.orders.getById`**
```typescript
// Używane w [orderId]/page.tsx
const { data: order, isLoading } = useGetOrderById(orderId);
```
- Pobiera zamówienie po ID
- Zwraca tylko aktywne zamówienia

## Schema zamówienia

```typescript
{
  _id: Id<"orders">,
  _creationTime: number,      // Automatyczny timestamp utworzenia
  userId: Id<"users">,
  name?: string,              // Opcjonalna nazwa
  code: string,               // 3-znakowy kod (np. "ABC")
  orderTime: number,          // Szacowany czas odbioru (timestamp)
  isActive: boolean,          // Czy zamówienie jest aktywne
  isReady: boolean,           // Czy zamówienie jest gotowe
  readyTime?: number,         // Potwierdzony czas odbioru (timestamp)
}
```

## Porównanie z `/show-order`

| Cecha | `/show-order` | `/show-order-by-timeline` |
|-------|---------------|---------------------------|
| Wprowadzanie kodu | ✅ `CodeInputModal` | ✅ `CodeInputModal` |
| Routing | `[orderId]` | `[orderId]` |
| API | `useGetOrderByCode` + `useGetOrderById` | `useGetOrderByCode` + `useGetOrderById` |
| Wyświetlanie | Countdown + status | Timeline z historią |
| Cel | Szybki podgląd czasu | Szczegółowa historia |

## Przykład użycia

```typescript
// 1. Użytkownik wchodzi na stronę
/show-order-by-timeline

// 2. Wprowadza kod "ABC"
CodeInputModal -> InputOTP: "ABC"

// 3. System sprawdza kod
useGetOrderByCode("ABC") -> order: { _id: "j57...", ... }

// 4. Przekierowanie
router.push("/show-order-by-timeline/j57...")

// 5. Wyświetlenie timeline
useGetOrderById("j57...") -> order data
Timeline with activeIndex based on order status
```

## Build

```bash
✓ Compiled successfully
✓ /show-order-by-timeline (6.69 kB)
✓ /show-order-by-timeline/[orderId] (4.96 kB)
```

## Gotowe! 🎉

Moduł działa dokładnie tak samo jak `show-order`, ale zamiast countdown wyświetla timeline z historią zamówienia.

