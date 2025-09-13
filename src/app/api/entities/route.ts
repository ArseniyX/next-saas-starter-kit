import { NextRequest, NextResponse } from "next/server"
import { db, entities, type NewEntity } from "@/lib/db"
import { eq, desc, and, like, or } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

// Get all entities with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const role = searchParams.get("role")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    let whereClause = undefined

    // Build filter conditions
    const conditions = []
    
    if (search) {
      conditions.push(
        or(
          like(entities.name, `%${search}%`),
          like(entities.email, `%${search}%`)
        )
      )
    }
    
    if (status && status !== "all") {
      conditions.push(eq(entities.status, status as any))
    }
    
    if (role && role !== "all") {
      conditions.push(eq(entities.role, role as any))
    }

    if (conditions.length > 0) {
      whereClause = and(...conditions)
    }

    const result = await db
      .select()
      .from(entities)
      .where(whereClause)
      .orderBy(desc(entities.createdAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching entities:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Create a new entity
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, role, status, phone, company, avatar } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEntity = await db
      .select()
      .from(entities)
      .where(eq(entities.email, email))
      .limit(1)

    if (existingEntity.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      )
    }

    const newEntity: NewEntity = {
      name,
      email,
      role: role || "viewer",
      status: status || "pending",
      phone,
      company,
      avatar,
      createdBy: (session.user as any).id,
      lastLogin: null,
    }

    const result = await db.insert(entities).values(newEntity).returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating entity:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}