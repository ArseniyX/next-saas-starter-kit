import { NextRequest, NextResponse } from "next/server"
import { db, users } from "@/lib/db"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

// Get user profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, (session.user as any).id))
      .limit(1)

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive data
    const { ...userData } = user[0]
    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      phone,
      company,
      location,
      theme,
      language,
      timezone,
      emailNotifications,
      pushNotifications,
      securityAlerts,
      marketingEmails,
      weeklyReports,
      billingUpdates,
    } = body

    const updateData: Partial<typeof users.$inferInsert> = {}
    
    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (company !== undefined) updateData.company = company
    if (location !== undefined) updateData.location = location
    if (theme !== undefined) updateData.theme = theme
    if (language !== undefined) updateData.language = language
    if (timezone !== undefined) updateData.timezone = timezone
    if (emailNotifications !== undefined) updateData.emailNotifications = emailNotifications
    if (pushNotifications !== undefined) updateData.pushNotifications = pushNotifications
    if (securityAlerts !== undefined) updateData.securityAlerts = securityAlerts
    if (marketingEmails !== undefined) updateData.marketingEmails = marketingEmails
    if (weeklyReports !== undefined) updateData.weeklyReports = weeklyReports
    if (billingUpdates !== undefined) updateData.billingUpdates = billingUpdates
    
    updateData.updatedAt = new Date()

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, (session.user as any).id))
      .returning()

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { ...userData } = result[0]
    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}