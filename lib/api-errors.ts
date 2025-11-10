import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error("API Error:", error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const errors = error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return NextResponse.json(
      {
        error: "Validation failed",
        details: errors,
      },
      { status: 400 }
    );
  }

  // Handle custom API errors
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Handle Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code: string; meta?: any };

    switch (prismaError.code) {
      case "P2002":
        return NextResponse.json(
          { error: "A record with this information already exists" },
          { status: 409 }
        );
      case "P2025":
        return NextResponse.json(
          { error: "Record not found" },
          { status: 404 }
        );
      case "P2003":
        return NextResponse.json(
          { error: "Invalid reference" },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          { error: "Database error occurred" },
          { status: 500 }
        );
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === "production"
          ? "An unexpected error occurred"
          : error.message,
      },
      { status: 500 }
    );
  }

  // Fallback error
  return NextResponse.json(
    { error: "An unexpected error occurred" },
    { status: 500 }
  );
}

export function createSuccessResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    { status }
  );
}

export function createErrorResponse(message: string, status: number = 400, code?: string): NextResponse {
  return NextResponse.json(
    {
      error: message,
      ...(code && { code }),
    },
    { status }
  );
}
