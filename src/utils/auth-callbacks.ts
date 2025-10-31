import { MutationCtx } from "../../convex/_generated/server";
import { Id } from "../../convex/_generated/dataModel";

/**
 * Funkcja callback do automatycznego łączenia kont użytkowników.
 * Jeśli użytkownik loguje się przez różne metody (Google, OTP)
 * ale z tym samym emailem, konta zostaną automatycznie połączone.
 */
export async function createOrUpdateUser(
  ctx: MutationCtx,
  args: {
    existingUserId?: Id<"users"> | null;
    profile?: {
      email?: string;
      name?: string;
      image?: string;
      emailVerified?: boolean;
    };
  }
) {
  // Jeśli użytkownik już istnieje, zaktualizuj go
  if (args.existingUserId !== undefined && args.existingUserId !== null) {
    if (args.profile) {
      const updateData: Record<string, any> = {};

      if (args.profile.name !== undefined) {
        updateData.name = args.profile.name;
      }
      if (args.profile.image !== undefined) {
        updateData.image = args.profile.image;
      }
      if (args.profile.emailVerified) {
        updateData.emailVerificationTime = Date.now();
      }

      if (Object.keys(updateData).length > 0) {
        await ctx.db.patch(args.existingUserId, updateData);
      }
    }
    return args.existingUserId;
  }

  // Dla nowego użytkownika sprawdź, czy istnieje już konto z tym emailem
  if (args.profile?.email) {
    // Szukaj istniejącego użytkownika z tym emailem
    const existingUser = await ctx.db
      .query("users")
      .filter((q: any) => q.eq(q.field("email"), args.profile!.email))
      .first();

    if (existingUser) {
      // Znaleziono użytkownika z tym samym emailem!
      // Zamiast tworzyć nowego, zwróć ID istniejącego
      // Convex Auth automatycznie połączy authAccount z tym użytkownikiem
      console.log(
        `Account linking: Łączenie konta dla ${args.profile.email} z istniejącym użytkownikiem ${existingUser._id}`
      );

      // Opcjonalnie zaktualizuj dane (np. name, image) z nowego providera
      const updateData: Record<string, any> = {};

      if (args.profile.name && !existingUser.name) {
        updateData.name = args.profile.name;
      }
      if (args.profile.image && !existingUser.image) {
        updateData.image = args.profile.image;
      }
      if (args.profile.emailVerified && !existingUser.emailVerificationTime) {
        updateData.emailVerificationTime = Date.now();
      }

      if (Object.keys(updateData).length > 0) {
        await ctx.db.patch(existingUser._id, updateData);
      }

      return existingUser._id;
    }
  }

  // Nie znaleziono użytkownika - utwórz nowego
  return await ctx.db.insert("users", {
    email: args.profile?.email,
    emailVerificationTime: args.profile?.emailVerified ? Date.now() : undefined,
    name: args.profile?.name,
    image: args.profile?.image,
  });
}
