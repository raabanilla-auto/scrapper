import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE_NAME = "sl_session";
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return s;
}

function sign(expires: number) {
  return createHmac("sha256", secret()).update(String(expires)).digest("hex");
}

export function makeSessionCookieValue() {
  const expires = Date.now() + SESSION_MS;
  return { value: `${expires}.${sign(expires)}`, expires: new Date(expires) };
}

export function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const [expiresStr, sig] = cookieValue.split(".");
  const expires = Number(expiresStr);
  if (!expires || !sig || Date.now() > expires) return false;

  const expected = sign(expires);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function passwordMatches(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
