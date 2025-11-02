import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };

    const alphabet = "0123456789";
    const length = 4;
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);

    if (email === "test@gmail.com") {
      console.log("MOCK EMAIL:", { email, token });
      return;
    }

    const { error } = await resend.emails.send({
      from: "Grupa Rodziców <info@auth.gruparodzicow.pl>",
      to: [email],
      subject: `Logowanie do Grupy Rodziców`,
      text: [
        "Oto Twój kod uwierzytelniający: ",
        token,
        "",
        "Ten kod jest ważny przez 15 minut i można go użyć tylko raz.",
        "Prosimy nie udostępniaj tego kodu nikomu! Nigdy nie poprosimy o niego przez telefon ani e-mail.",
        "",
        "Dziękujemy,",
        "Zespół gruparodzicow.pl",
      ].join("\n"),
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});
