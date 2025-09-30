import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateStatusSchema = z.object({
	status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

// GET /api/applications/[id] - Fetch single application
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const application = await prisma.application.findUnique({
			where: { id },
		});

		if (!application) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(application);
	} catch (error) {
		console.error("Error fetching application:", error);
		return NextResponse.json(
			{ error: "Failed to fetch application" },
			{ status: 500 },
		);
	}
}

// PATCH /api/applications/[id] - Update application status
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await request.json();

		// Validate the request body
		const validatedData = updateStatusSchema.parse(body);

		// Check if application exists
		const existingApplication = await prisma.application.findUnique({
			where: { id },
		});

		if (!existingApplication) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 },
			);
		}

		// Update the application status
		const updatedApplication = await prisma.application.update({
			where: { id },
			data: {
				status: validatedData.status,
				updatedAt: new Date(),
			},
		});

		return NextResponse.json(updatedApplication);
	} catch (error) {
		console.error("Error updating application:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid status provided", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to update application" },
			{ status: 500 },
		);
	}
}

// DELETE /api/applications/[id] - Delete application (optional)
export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		// Check if application exists
		const existingApplication = await prisma.application.findUnique({
			where: { id },
		});

		if (!existingApplication) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 },
			);
		}

		// Delete the application
		await prisma.application.delete({
			where: { id },
		});

		return NextResponse.json({ message: "Application deleted successfully" });
	} catch (error) {
		console.error("Error deleting application:", error);
		return NextResponse.json(
			{ error: "Failed to delete application" },
			{ status: 500 },
		);
	}
}
