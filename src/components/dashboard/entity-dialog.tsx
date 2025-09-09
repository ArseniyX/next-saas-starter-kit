"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Entity {
  id: string
  name: string
  email: string
  role: string
  status: string
  lastLogin: string
  avatar: string
}

interface EntityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entity: Entity | null
  onSave: (entity: Entity) => void
}

export function EntityDialog({ open, onOpenChange, entity, onSave }: EntityDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "viewer",
    status: "active",
  })

  useEffect(() => {
    if (entity) {
      setFormData({
        name: entity.name,
        email: entity.email,
        role: entity.role.toLowerCase(),
        status: entity.status.toLowerCase(),
      })
    } else {
      setFormData({
        name: "",
        email: "",
        role: "viewer",
        status: "active",
      })
    }
  }, [entity])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const entityData: Entity = {
      id: entity?.id || "",
      name: formData.name,
      email: formData.email,
      role: formData.role.charAt(0).toUpperCase() + formData.role.slice(1),
      status: formData.status.charAt(0).toUpperCase() + formData.status.slice(1),
      lastLogin: entity?.lastLogin || "Never",
      avatar: entity?.avatar || "/diverse-user-avatars.png",
    }

    onSave(entityData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{entity ? "Edit Entity" : "Add New Entity"}</DialogTitle>
          <DialogDescription>
            {entity ? "Update the entity information below." : "Fill in the information to create a new entity."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{entity ? "Update" : "Create"} Entity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
