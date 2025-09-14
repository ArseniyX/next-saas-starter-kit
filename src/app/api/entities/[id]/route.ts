import { NextRequest, NextResponse } from "next/server"
import { db, entities } from "@/lib/db"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

// Get a specific entity
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const entity = await db
      .select()
      .from(entities)
      .where(eq(entities.id, id))
      .limit(1)

    if (entity.length === 0) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 })
    }

    return NextResponse.json(entity[0])
  } catch (error) {
    console.error("Error fetching entity:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Update an entity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, email, role, status, phone, company, avatar } = body

    // Check if entity exists
    const existingEntity = await db
      .select()
      .from(entities)
      .where(eq(entities.id, id))
      .limit(1)

    if (existingEntity.length === 0) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 })
    }

    // Check if email is taken by another entity
    if (email && email !== existingEntity[0].email) {
      const emailTaken = await db
        .select()
        .from(entities)
        .where(eq(entities.email, email))
        .limit(1)

      if (emailTaken.length > 0) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        )
      }
    }

    const updateData: Partial<typeof existingEntity[0]> = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (role !== undefined) updateData.role = role
    if (status !== undefined) updateData.status = status
    if (phone !== undefined) updateData.phone = phone
    if (company !== undefined) updateData.company = company
    if (avatar !== undefined) updateData.avatar = avatar
    
    updateData.updatedAt = new Date()

    const result = await db
      .update(entities)
      .set(updateData)
      .where(eq(entities.id, id))
      .returning()

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating entity:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Delete an entity
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if entity exists
    const existingEntity = await db
      .select()
      .from(entities)
      .where(eq(entities.id, id))
      .limit(1)

    if (existingEntity.length === 0) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 })
    }

    await db.delete(entities).where(eq(entities.id, id))

    return NextResponse.json({ message: "Entity deleted successfully" })
  } catch (error) {
    console.error("Error deleting entity:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}