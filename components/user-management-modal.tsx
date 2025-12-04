"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: string
  phone?: string
  lastLogin?: string
  isActive: boolean
  image?: string
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  tiktok?: string
  whatsapp?: string
  youtube?: string
}

interface UserManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (user: User) => void
  editingUser?: User | null
}

export function UserManagementModal({ isOpen, onClose, onSave, editingUser }: UserManagementModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "asesor",
    phone: "",
    isActive: true,
    image: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    tiktok: "",
    whatsapp: "",
    youtube: "",
  })

  const [phoneCode, setPhoneCode] = useState("0412")
  const [phoneNumber, setPhoneNumber] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (isOpen && editingUser) {
      setFormData({
        id: editingUser.id,
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        phone: editingUser.phone || "",
        isActive: editingUser.isActive,
        image: editingUser.image || "",
        facebook: editingUser.facebook || "",
        instagram: editingUser.instagram || "",
        twitter: editingUser.twitter || "",
        linkedin: editingUser.linkedin || "",
        tiktok: editingUser.tiktok || "",
        whatsapp: editingUser.whatsapp || "",
        youtube: editingUser.youtube || "",
      })
      if (editingUser.phone) {
        const [code, number] = editingUser.phone.split("-")
        setPhoneCode(code || "0412")
        setPhoneNumber(number || "")
      } else {
        setPhoneCode("0412")
        setPhoneNumber("")
      }
      setPreview(editingUser.image || "")
      setImageFile(null)
    } else if (isOpen) {
      setFormData({
        name: "",
        email: "",
        role: "asesor",
        phone: "",
        isActive: true,
        image: "",
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        tiktok: "",
        whatsapp: "",
        youtube: "",
      })
      setPhoneCode("0412")
      setPhoneNumber("")
      setPreview("")
      setImageFile(null)
    }
    setErrors({})
  }, [isOpen, editingUser])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) newErrors.name = "El nombre es requerido"
    if (!formData.email?.trim()) newErrors.email = "El email es requerido"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || "")) newErrors.email = "Email inválido"
    if (!formData.role) newErrors.role = "El rol es requerido"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setPreview("")
    setImageFile(null)
    setFormData({ ...formData, image: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsUploading(true)

    try {
      let imageUrl = editingUser?.image || ""

      if (imageFile) {
        const formDataFile = new FormData()
        formDataFile.append("file", imageFile)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataFile,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.url
        } else {
          console.error("[v0] Error uploading image")
          setIsUploading(false)
          return
        }
      }

      const fullPhone = phoneNumber ? `${phoneCode}-${phoneNumber}` : ""

      const newUser: User = {
        id: editingUser?.id || Math.random(),
        name: formData.name || "",
        email: formData.email || "",
        role: formData.role || "asesor",
        phone: fullPhone,
        isActive: formData.isActive !== false,
        lastLogin: editingUser?.lastLogin,
        image: imageUrl,
        facebook: formData.facebook || "",
        instagram: formData.instagram || "",
        twitter: formData.twitter || "",
        linkedin: formData.linkedin || "",
        tiktok: formData.tiktok || "",
        whatsapp: formData.whatsapp || fullPhone,
        youtube: formData.youtube || "",
      }

      onSave(newUser)
      handleClose()
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-neutral-900 border-primary/30 max-w-lg rounded-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold text-white">
            {editingUser ? "Editar Usuario" : "Agregar Nuevo Usuario"}
          </DialogTitle>
          <p className="text-gray-400 text-sm">
            {editingUser ? "Actualiza los datos del usuario" : "Crea un nuevo usuario en el sistema"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm font-medium">Foto de Perfil</Label>
            <div className="flex gap-4 items-start">
              {preview ? (
                <div className="relative w-24 h-24">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 bg-neutral-800 rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center">
                  <Upload size={24} className="text-primary/50" />
                </div>
              )}
              <div className="flex-1">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                <label htmlFor="image-upload">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-neutral-800 border-primary/30 text-white hover:bg-neutral-700 cursor-pointer disabled:opacity-50"
                    onClick={() => document.getElementById("image-upload")?.click()}
                    disabled={isUploading}
                  >
                    Seleccionar Foto
                  </Button>
                </label>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG o GIF (máx. 2MB)</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300 text-sm font-medium">
              Nombre Completo
            </Label>
            <Input
              id="name"
              placeholder="Ej: Carlos Asesor"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-neutral-800 border-primary/30 text-white placeholder-gray-500 focus:border-primary"
            />
            {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Ej: usuario@test.com"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-neutral-800 border-primary/30 text-white placeholder-gray-500 focus:border-primary"
            />
            {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300 text-sm font-medium">Teléfono (Opcional)</Label>
            <div className="flex gap-2">
              <select
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value)}
                className="bg-neutral-800 border border-primary/30 text-white px-3 py-2 rounded-lg focus:border-primary focus:outline-none transition-colors w-24"
              >
                <option value="0412">0412</option>
                <option value="0424">0424</option>
                <option value="0414">0414</option>
                <option value="0426">0426</option>
                <option value="0422">0422</option>
                <option value="0416">0416</option>
              </select>
              <Input
                placeholder="2928717"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 7))}
                maxLength={7}
                className="bg-neutral-800 border-primary/30 text-white placeholder-gray-500 focus:border-primary flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-300 text-sm font-medium">
              Rol
            </Label>
            <select
              id="role"
              value={formData.role || "asesor"}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-neutral-800 border border-primary/30 text-white px-3 py-2 rounded-lg focus:border-primary focus:outline-none transition-colors"
            >
              <option value="asesor">Asesor</option>
              <option value="gerencia">Gerencia</option>
              <option value="admin">Administrador</option>
            </select>
            {errors.role && <p className="text-red-400 text-xs">{errors.role}</p>}
          </div>

          <div className="flex items-center justify-between bg-neutral-800/50 px-3 py-3 rounded-lg border border-primary/20">
            <Label htmlFor="active" className="text-gray-300 text-sm font-medium cursor-pointer">
              Estado
            </Label>
            <div className="flex items-center gap-2">
              <input
                id="active"
                type="checkbox"
                checked={formData.isActive !== false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-gray-400">{formData.isActive !== false ? "Activo" : "Inactivo"}</span>
            </div>
          </div>

          <div className="border-t border-primary/10 pt-4">
            <p className="text-gray-300 text-sm font-medium mb-3">Redes Sociales (Opcional)</p>
            <div className="space-y-2">
              <div>
                <Label className="text-gray-400 text-xs">Instagram</Label>
                <Input
                  placeholder="@username"
                  value={formData.instagram || ""}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="bg-neutral-800 border-primary/30 text-white placeholder-gray-500 focus:border-primary"
                />
              </div>
              <div>
                <Label className="text-gray-400 text-xs">Facebook</Label>
                <Input
                  placeholder="facebook.com/user"
                  value={formData.facebook || ""}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="bg-neutral-800 border-primary/30 text-white placeholder-gray-500 focus:border-primary"
                />
              </div>
              <div>
                <Label className="text-gray-400 text-xs">Twitter</Label>
                <Input
                  placeholder="@username"
                  value={formData.twitter || ""}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  className="bg-neutral-800 border-primary/30 text-white placeholder-gray-500 focus:border-primary"
                />
              </div>
              <div>
                <Label className="text-gray-400 text-xs">LinkedIn</Label>
                <Input
                  placeholder="linkedin.com/in/user"
                  value={formData.linkedin || ""}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="bg-neutral-800 border-primary/30 text-white placeholder-gray-500 focus:border-primary"
                />
              </div>
              <div>
                <Label className="text-gray-400 text-xs">TikTok</Label>
                <Input
                  placeholder="@username"
                  value={formData.tiktok || ""}
                  onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                  className="bg-neutral-800 border-primary/30 text-white placeholder-gray-500 focus:border-primary"
                />
              </div>
              <div>
                <Label className="text-gray-400 text-xs">YouTube</Label>
                <Input
                  placeholder="youtube.com/user"
                  value={formData.youtube || ""}
                  onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                  className="bg-neutral-800 border-primary/30 text-white placeholder-gray-500 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="flex gap-2 justify-end pt-4 border-t border-primary/10">
          <Button
            type="button"
            onClick={handleClose}
            className="bg-neutral-800 hover:bg-neutral-700 text-white border border-primary/20"
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-white transition-all duration-300 disabled:opacity-50"
            disabled={isUploading}
          >
            {isUploading ? "Guardando..." : editingUser ? "Guardar Cambios" : "Crear Usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
