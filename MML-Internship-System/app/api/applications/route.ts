import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { applicationSchema } from "@/lib/validations"
import { z } from "zod"

// GET /api/applications - Fetch all applications
export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

// POST /api/applications - Create new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = applicationSchema.parse(body)

    // Check if an application with the same email/contact already exists
    const existingApplication = await prisma.application.findFirst({
      where: {
        OR: [{ contactNumber: validatedData.contactNumber }, { legalName: validatedData.legalName }],
      },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: "An application with this name or contact number already exists" },
        { status: 409 },
      )
    }

    // Create the application
    const application = await prisma.application.create({
      data: validatedData,
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error("Error creating application:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data provided", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}
