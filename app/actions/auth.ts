"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { makeSessionCookieValue, passwordMatches, SESSION_COOKIE_NAME } from "@/lib/session";

export type LoginState = { error: string } | undefined;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.AUTH_PASSWORD;

  if (!expected) {
    return { error: "AUTH_PASSWORD is not configured on the server." };
  }
  if (!password || !passwordMatches(password, expected)) {
    return { error: "Incorrect password." };
  }

  const session = makeSessionCookieValue();
  (await cookies()).set(SESSION_COOKIE_NAME, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: session.expires,
  });

  redirect("/");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
