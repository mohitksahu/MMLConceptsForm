import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/applications/stats - Get application statistics
export async function GET() {
  try {
    const [total, pending, approved, rejected, roleStats] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({ where: { status: "PENDING" } }),
      prisma.application.count({ where: { status: "APPROVED" } }),
      prisma.application.count({ where: { status: "REJECTED" } }),
      prisma.application.groupBy({
        by: ["role"],
        _count: {
          role: true,
        },
      }),
    ])

    const roleStatsFormatted = roleStats.reduce(
      (acc, stat) => {
        acc[stat.role] = stat._count.role
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      total,
      pending,
      approved,
      rejected,
      byRole: roleStatsFormatted,
    })
  } catch (error) {
    console.error("Error fetching application stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
