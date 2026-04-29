import { timingSafeEqual } from "node:crypto";

function safeEquals(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export function isAuthorizedSecret(request: Request, secret: string | undefined, headerName: string): boolean {
  if (!secret) return false;
  const provided = request.headers.get(headerName) ?? "";
  return safeEquals(provided, secret);
}

export function isAuthorizedBearer(request: Request, secret: string | undefined): boolean {
  if (!secret) return false;
  const authHeader = request.headers.get("authorization") ?? "";
  return safeEquals(authHeader, `Bearer ${secret}`);
}
