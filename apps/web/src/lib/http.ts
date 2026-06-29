/**
 * HTTP helpers + small validation helpers for API routes.
 */
import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

export function jsonError(message: string, status = 400, code?: string) {
  return NextResponse.json({ error: { message, code } }, { status });
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export async function parseBody<T>(req: Request, schema: ZodSchema<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new HttpError(400, "Invalid JSON body", "invalid_json");
  }
  try {
    return schema.parse(raw);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new HttpError(422, "Validation failed", "validation_failed");
    }
    throw err;
  }
}

export class HttpError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
    this.name = "HttpError";
  }
}

export function handleError(err: unknown): NextResponse {
  if (err instanceof HttpError) {
    return jsonError(err.message, err.status, err.code);
  }
  console.error("[api] unhandled", err);
  return jsonError("Internal error", 500, "internal");
}
