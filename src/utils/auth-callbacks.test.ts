import type { Id } from "@convex/_generated/dataModel";
import type { MutationCtx } from "@convex/_generated/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOrUpdateUser } from "./auth-callbacks";

// Helper do tworzenia mock context
function createMockContext() {
  const mockDb = {
    patch: vi.fn(),
    insert: vi.fn(),
    query: vi.fn(),
    get: vi.fn(),
  };

  return {
    db: mockDb,
  } as unknown as MutationCtx;
}

describe("createOrUpdateUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Aktualizacja istniejącego użytkownika", () => {
    it("powinien zaktualizować name istniejącego użytkownika", async () => {
      const ctx = createMockContext();
      const userId = "test-user-id" as Id<"users">;

      const result = await createOrUpdateUser(ctx, {
        existingUserId: userId,
        profile: {
          name: "Jan Kowalski",
        },
      });

      expect(result).toBe(userId);
      expect(ctx.db.patch).toHaveBeenCalledWith(userId, {
        name: "Jan Kowalski",
      });
    });

    it("powinien zaktualizować image istniejącego użytkownika", async () => {
      const ctx = createMockContext();
      const userId = "test-user-id" as Id<"users">;

      await createOrUpdateUser(ctx, {
        existingUserId: userId,
        profile: {
          image: "https://example.com/avatar.jpg",
        },
      });

      expect(ctx.db.patch).toHaveBeenCalledWith(userId, {
        image: "https://example.com/avatar.jpg",
      });
    });

    it("powinien ustawić emailVerificationTime gdy emailVerified jest true", async () => {
      const ctx = createMockContext();
      const userId = "test-user-id" as Id<"users">;
      const beforeTime = Date.now();

      await createOrUpdateUser(ctx, {
        existingUserId: userId,
        profile: {
          emailVerified: true,
        },
      });

      const afterTime = Date.now();

      expect(ctx.db.patch).toHaveBeenCalled();
      const patchCall = (ctx.db.patch as any).mock.calls[0];
      expect(patchCall[0]).toBe(userId);
      expect(patchCall[1].emailVerificationTime).toBeDefined();
      expect(patchCall[1].emailVerificationTime).toBeGreaterThanOrEqual(
        beforeTime
      );
      expect(patchCall[1].emailVerificationTime).toBeLessThanOrEqual(afterTime);
    });

    it("powinien zaktualizować wiele pól jednocześnie", async () => {
      const ctx = createMockContext();
      const userId = "test-user-id" as Id<"users">;

      await createOrUpdateUser(ctx, {
        existingUserId: userId,
        profile: {
          name: "Jan Kowalski",
          image: "https://example.com/avatar.jpg",
          emailVerified: true,
        },
      });

      expect(ctx.db.patch).toHaveBeenCalled();
      const patchCall = (ctx.db.patch as any).mock.calls[0];
      expect(patchCall[1].name).toBe("Jan Kowalski");
      expect(patchCall[1].image).toBe("https://example.com/avatar.jpg");
      expect(patchCall[1].emailVerificationTime).toBeDefined();
    });

    it("nie powinien aktualizować gdy profile jest undefined", async () => {
      const ctx = createMockContext();
      const userId = "test-user-id" as Id<"users">;

      await createOrUpdateUser(ctx, {
        existingUserId: userId,
      });

      expect(ctx.db.patch).not.toHaveBeenCalled();
    });

    it("nie powinien aktualizować gdy wszystkie pola są undefined", async () => {
      const ctx = createMockContext();
      const userId = "test-user-id" as Id<"users">;

      await createOrUpdateUser(ctx, {
        existingUserId: userId,
        profile: {
          name: undefined,
          image: undefined,
          emailVerified: false,
        },
      });

      expect(ctx.db.patch).not.toHaveBeenCalled();
    });
  });

  describe("Automatyczne łączenie kont po email", () => {
    it("powinien połączyć konto gdy użytkownik z tym emailem już istnieje", async () => {
      const ctx = createMockContext();
      const existingUserId = "existing-user-id" as Id<"users">;

      // Mock query chain
      const mockFilter = vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue({
          _id: existingUserId,
          email: "test@example.com",
          name: "Istniejący Użytkownik",
        }),
      });
      (ctx.db.query as any).mockReturnValue({
        filter: mockFilter,
      });

      const result = await createOrUpdateUser(ctx, {
        profile: {
          email: "test@example.com",
          name: "Nowy Użytkownik",
          image: "https://example.com/new-avatar.jpg",
        },
      });

      expect(result).toBe(existingUserId);
      expect(ctx.db.query).toHaveBeenCalledWith("users");
      expect(ctx.db.insert).not.toHaveBeenCalled();
    });

    it("powinien zaktualizować name gdy istniejący użytkownik nie ma name", async () => {
      const ctx = createMockContext();
      const existingUserId = "existing-user-id" as Id<"users">;

      const mockFilter = vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue({
          _id: existingUserId,
          email: "test@example.com",
          // Brak name
        }),
      });
      (ctx.db.query as any).mockReturnValue({
        filter: mockFilter,
      });

      await createOrUpdateUser(ctx, {
        profile: {
          email: "test@example.com",
          name: "Jan Kowalski",
        },
      });

      expect(ctx.db.patch).toHaveBeenCalledWith(existingUserId, {
        name: "Jan Kowalski",
      });
    });

    it("nie powinien nadpisać istniejącego name", async () => {
      const ctx = createMockContext();
      const existingUserId = "existing-user-id" as Id<"users">;

      const mockFilter = vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue({
          _id: existingUserId,
          email: "test@example.com",
          name: "Oryginalne Imię",
        }),
      });
      (ctx.db.query as any).mockReturnValue({
        filter: mockFilter,
      });

      await createOrUpdateUser(ctx, {
        profile: {
          email: "test@example.com",
          name: "Nowe Imię",
        },
      });

      const patchCalls = (ctx.db.patch as any).mock.calls;
      if (patchCalls.length > 0) {
        expect(patchCalls[0][1].name).toBeUndefined();
      }
    });

    it("powinien zaktualizować image gdy istniejący użytkownik nie ma image", async () => {
      const ctx = createMockContext();
      const existingUserId = "existing-user-id" as Id<"users">;

      const mockFilter = vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue({
          _id: existingUserId,
          email: "test@example.com",
        }),
      });
      (ctx.db.query as any).mockReturnValue({
        filter: mockFilter,
      });

      await createOrUpdateUser(ctx, {
        profile: {
          email: "test@example.com",
          image: "https://example.com/avatar.jpg",
        },
      });

      expect(ctx.db.patch).toHaveBeenCalledWith(existingUserId, {
        image: "https://example.com/avatar.jpg",
      });
    });

    it("nie powinien nadpisać istniejącego image", async () => {
      const ctx = createMockContext();
      const existingUserId = "existing-user-id" as Id<"users">;

      const mockFilter = vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue({
          _id: existingUserId,
          email: "test@example.com",
          image: "https://example.com/original.jpg",
        }),
      });
      (ctx.db.query as any).mockReturnValue({
        filter: mockFilter,
      });

      await createOrUpdateUser(ctx, {
        profile: {
          email: "test@example.com",
          image: "https://example.com/new.jpg",
        },
      });

      const patchCalls = (ctx.db.patch as any).mock.calls;
      if (patchCalls.length > 0) {
        expect(patchCalls[0][1].image).toBeUndefined();
      }
    });

    it("powinien ustawić emailVerificationTime gdy istniejący użytkownik nie ma emailVerificationTime", async () => {
      const ctx = createMockContext();
      const existingUserId = "existing-user-id" as Id<"users">;

      const mockFilter = vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue({
          _id: existingUserId,
          email: "test@example.com",
        }),
      });
      (ctx.db.query as any).mockReturnValue({
        filter: mockFilter,
      });

      await createOrUpdateUser(ctx, {
        profile: {
          email: "test@example.com",
          emailVerified: true,
        },
      });

      expect(ctx.db.patch).toHaveBeenCalled();
      const patchCall = (ctx.db.patch as any).mock.calls[0];
      expect(patchCall[1].emailVerificationTime).toBeDefined();
    });

    it("nie powinien nadpisać istniejącego emailVerificationTime", async () => {
      const ctx = createMockContext();
      const existingUserId = "existing-user-id" as Id<"users">;
      const originalTime = Date.now() - 1000;

      const mockFilter = vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue({
          _id: existingUserId,
          email: "test@example.com",
          emailVerificationTime: originalTime,
        }),
      });
      (ctx.db.query as any).mockReturnValue({
        filter: mockFilter,
      });

      await createOrUpdateUser(ctx, {
        profile: {
          email: "test@example.com",
          emailVerified: true,
        },
      });

      const patchCalls = (ctx.db.patch as any).mock.calls;
      if (patchCalls.length > 0) {
        expect(patchCalls[0][1].emailVerificationTime).toBeUndefined();
      }
    });
  });

  describe("Tworzenie nowego użytkownika", () => {
    it("powinien utworzyć nowego użytkownika gdy email nie istnieje", async () => {
      const ctx = createMockContext();
      const newUserId = "new-user-id" as Id<"users">;

      const mockFilter = vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue(null),
      });
      (ctx.db.query as any).mockReturnValue({
        filter: mockFilter,
      });
      (ctx.db.insert as any).mockResolvedValue(newUserId);

      const result = await createOrUpdateUser(ctx, {
        profile: {
          email: "new@example.com",
          name: "Nowy Użytkownik",
          image: "https://example.com/avatar.jpg",
          emailVerified: true,
        },
      });

      expect(result).toBe(newUserId);
      expect(ctx.db.insert).toHaveBeenCalledWith("users", {
        email: "new@example.com",
        name: "Nowy Użytkownik",
        image: "https://example.com/avatar.jpg",
        emailVerificationTime: expect.any(Number),
      });
    });

    it("powinien utworzyć użytkownika z minimalnym profilem", async () => {
      const ctx = createMockContext();
      const newUserId = "new-user-id" as Id<"users">;

      const mockFilter = vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue(null),
      });
      (ctx.db.query as any).mockReturnValue({
        filter: mockFilter,
      });
      (ctx.db.insert as any).mockResolvedValue(newUserId);

      await createOrUpdateUser(ctx, {
        profile: {
          email: "minimal@example.com",
        },
      });

      expect(ctx.db.insert).toHaveBeenCalledWith("users", {
        email: "minimal@example.com",
        emailVerificationTime: undefined,
        name: undefined,
        image: undefined,
      });
    });

    it("powinien utworzyć użytkownika bez emailVerificationTime gdy emailVerified jest false", async () => {
      const ctx = createMockContext();
      const newUserId = "new-user-id" as Id<"users">;

      const mockFilter = vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue(null),
      });
      (ctx.db.query as any).mockReturnValue({
        filter: mockFilter,
      });
      (ctx.db.insert as any).mockResolvedValue(newUserId);

      await createOrUpdateUser(ctx, {
        profile: {
          email: "unverified@example.com",
          emailVerified: false,
        },
      });

      const insertCall = (ctx.db.insert as any).mock.calls[0];
      expect(insertCall[1].emailVerificationTime).toBeUndefined();
    });

    it("powinien utworzyć użytkownika bez email gdy nie podano", async () => {
      const ctx = createMockContext();
      const newUserId = "new-user-id" as Id<"users">;

      (ctx.db.insert as any).mockResolvedValue(newUserId);

      await createOrUpdateUser(ctx, {
        profile: {
          name: "Użytkownik bez emaila",
        },
      });

      expect(ctx.db.insert).toHaveBeenCalledWith("users", {
        email: undefined,
        name: "Użytkownik bez emaila",
        image: undefined,
        emailVerificationTime: undefined,
      });
    });
  });

  describe("Edge cases", () => {
    it("powinien obsłużyć null jako existingUserId", async () => {
      const ctx = createMockContext();
      const newUserId = "new-user-id" as Id<"users">;

      const mockFilter = vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue(null),
      });
      (ctx.db.query as any).mockReturnValue({
        filter: mockFilter,
      });
      (ctx.db.insert as any).mockResolvedValue(newUserId);

      const result = await createOrUpdateUser(ctx, {
        existingUserId: null,
        profile: {
          email: "test@example.com",
        },
      });

      expect(result).toBe(newUserId);
      expect(ctx.db.insert).toHaveBeenCalled();
    });

    it("powinien poprawnie obsłużyć pusty profile", async () => {
      const ctx = createMockContext();
      const newUserId = "new-user-id" as Id<"users">;

      (ctx.db.insert as any).mockResolvedValue(newUserId);

      await createOrUpdateUser(ctx, {
        profile: {},
      });

      expect(ctx.db.insert).toHaveBeenCalled();
    });

    it("powinien poprawnie obsłużyć undefined profile", async () => {
      const ctx = createMockContext();
      const newUserId = "new-user-id" as Id<"users">;

      (ctx.db.insert as any).mockResolvedValue(newUserId);

      await createOrUpdateUser(ctx, {});

      expect(ctx.db.insert).toHaveBeenCalled();
    });
  });

  describe("Bezpieczeństwo typów", () => {
    it("updateData powinno zawierać tylko dozwolone pola", async () => {
      const ctx = createMockContext();
      const userId = "test-user-id" as Id<"users">;

      await createOrUpdateUser(ctx, {
        existingUserId: userId,
        profile: {
          name: "Jan Kowalski",
          image: "https://example.com/avatar.jpg",
          emailVerified: true,
        },
      });

      expect(ctx.db.patch).toHaveBeenCalled();
      const patchCall = (ctx.db.patch as any).mock.calls[0];
      const updateData = patchCall[1];

      // Sprawdź że są tylko dozwolone klucze
      const allowedKeys = ["name", "image", "emailVerificationTime"];
      Object.keys(updateData).forEach((key) => {
        expect(allowedKeys).toContain(key);
      });
    });

    it("emailVerificationTime powinno być liczbą", async () => {
      const ctx = createMockContext();
      const userId = "test-user-id" as Id<"users">;

      await createOrUpdateUser(ctx, {
        existingUserId: userId,
        profile: {
          emailVerified: true,
        },
      });

      const patchCall = (ctx.db.patch as any).mock.calls[0];
      expect(typeof patchCall[1].emailVerificationTime).toBe("number");
    });

    it("nie powinno być możliwe przekazanie emailVerified do bazy", async () => {
      const ctx = createMockContext();
      const newUserId = "new-user-id" as Id<"users">;

      const mockFilter = vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue(null),
      });
      (ctx.db.query as any).mockReturnValue({
        filter: mockFilter,
      });
      (ctx.db.insert as any).mockResolvedValue(newUserId);

      await createOrUpdateUser(ctx, {
        profile: {
          email: "test@example.com",
          emailVerified: true,
        },
      });

      const insertCall = (ctx.db.insert as any).mock.calls[0];
      expect(insertCall[1].emailVerified).toBeUndefined();
      expect(insertCall[1].emailVerificationTime).toBeDefined();
    });
  });
});
