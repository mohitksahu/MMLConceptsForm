import { NextResponse } from "next/server"
import { z } from "zod"
import { Prisma } from "@prisma/client"

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = 500,
    public code?: string,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error)

  // Zod validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 },
    )
  }

  // Custom app errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode },
    )
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return NextResponse.json(
          {
            error: "A record with this information already exists",
            code: "DUPLICATE_ENTRY",
          },
          { status: 409 },
        )
      case "P2025":
        return NextResponse.json(
          {
            error: "Record not found",
            code: "NOT_FOUND",
          },
          { status: 404 },
        )
      default:
        return NextResponse.json(
          {
            error: "Database operation failed",
            code: "DATABASE_ERROR",
          },
          { status: 500 },
        )
    }
  }

  // Network/connection errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return NextResponse.json(
      {
        error: "Database connection failed",
        code: "CONNECTION_ERROR",
      },
      { status: 503 },
    )
  }

  // Generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    )
  }

  // Unknown errors
  return NextResponse.json(
    {
      error: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
    },
    { status: 500 },
  )
}
