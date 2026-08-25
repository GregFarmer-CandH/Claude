import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = () => {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET manquant dans les variables d'environnement");
  return new TextEncoder().encode(value);
};

export const ADMIN_COOKIE = "pd_admin_session";
export const CLIENT_COOKIE = "pd_client_session";

type AdminSessionPayload = { kind: "admin"; adminId: string; email: string };
type ClientSessionPayload = { kind: "client"; clientId: string; email: string };

async function sign(payload: Record<string, unknown>, expiresIn: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret());
}

async function verify<T>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as T;
  } catch {
    return null;
  }
}

// --- Session admin ---

export async function createAdminSession(adminId: string, email: string) {
  const token = await sign({ kind: "admin", adminId, email }, "12h");
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verify<AdminSessionPayload>(token);
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

// --- Session client (portail, via lien magique) ---

export async function createClientSession(clientId: string, email: string) {
  const token = await sign({ kind: "client", clientId, email }, "30d");
  const store = await cookies();
  store.set(CLIENT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getClientSession(): Promise<ClientSessionPayload | null> {
  const store = await cookies();
  const token = store.get(CLIENT_COOKIE)?.value;
  if (!token) return null;
  return verify<ClientSessionPayload>(token);
}

export async function clearClientSession() {
  const store = await cookies();
  store.delete(CLIENT_COOKIE);
}
