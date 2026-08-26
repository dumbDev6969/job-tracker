import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuthSession } from "@/features/auth"
import {
  getProfile,
  PROFILE_QUERY_KEY,
  updateProfile,
  uploadResume,
  downloadResume,
} from "@/features/profile/services/profileService"
import type { ProfileData } from "../profile.types"
import { DEFAULT_PROFILE } from "../profile.constants"

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "odt", "rtf"]

export function useProfileState() {
  const { user } = useAuthSession()
  const storageKey = `job_tracker_profile_${user?.id ?? "default"}`
  const queryClient = useQueryClient()

  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) }
      }
    } catch {
      // ignore
    }
    return {
      ...DEFAULT_PROFILE,
      fullName: user?.name ?? DEFAULT_PROFILE.fullName,
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState<ProfileData>(profile)
  const [newRoleInput, setNewRoleInput] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const [resumeUploadError, setResumeUploadError] = useState<string | null>(null)

  const saveSuccessTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch profile from backend
  const { data: backendProfile } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
    enabled: Boolean(user?.id),
  })

  // Sync backend profile data when received
  useEffect(() => {
    if (backendProfile) {
      const merged: ProfileData = {
        ...DEFAULT_PROFILE,
        ...backendProfile,
        fullName: backendProfile.fullName || user?.name || DEFAULT_PROFILE.fullName,
      }
      setProfile(merged)
      if (!isEditing) {
        setEditValues(merged)
      }
      try {
        localStorage.setItem(storageKey, JSON.stringify(merged))
      } catch {
        // ignore
      }
    }
  }, [backendProfile, user?.name, isEditing, storageKey])

  // Profile update mutation
  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, updated)
      setProfile(updated)
      setEditValues(updated)
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated))
      } catch {
        // ignore
      }
      setIsEditing(false)
      setSaveSuccess(true)
      if (saveSuccessTimeoutRef.current) {
        clearTimeout(saveSuccessTimeoutRef.current)
      }
      saveSuccessTimeoutRef.current = setTimeout(() => setSaveSuccess(false), 3000)
    },
  })

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveSuccessTimeoutRef.current) {
        clearTimeout(saveSuccessTimeoutRef.current)
      }
    }
  }, [])

  // Sync user name when user loads if not yet set
  useEffect(() => {
    if (user?.name && !profile.fullName) {
      setProfile((prev) => ({ ...prev, fullName: user.name }))
      setEditValues((prev) => ({ ...prev, fullName: user.name }))
    }
  }, [user?.name, profile.fullName])

  const handleSave = useCallback(() => {
    // Clean up empty custom links and normalize URLs
    const cleanedCustomLinks = (editValues.customLinks || [])
      .filter((link) => link.label.trim() !== "" || link.url.trim() !== "")
      .map((link) => ({
        ...link,
        label: link.label.trim() || "Link",
        url: link.url.trim(),
      }))

    const cleanValues: ProfileData = {
      ...editValues,
      customLinks: cleanedCustomLinks,
    }

    setProfile(cleanValues)
    setEditValues(cleanValues)
    try {
      localStorage.setItem(storageKey, JSON.stringify(cleanValues))
    } catch {
      // ignore
    }

    updateMutation.mutate(cleanValues)
  }, [editValues, storageKey, updateMutation])

  const handleCancel = useCallback(() => {
    setEditValues(profile)
    setIsEditing(false)
  }, [profile])

  const handleAddRole = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newRoleInput.trim()
    if (trimmed && !editValues.targetRoles.includes(trimmed)) {
      setEditValues((prev) => ({
        ...prev,
        targetRoles: [...prev.targetRoles, trimmed],
      }))
      setNewRoleInput("")
    }
  }, [newRoleInput, editValues.targetRoles])

  const handleRemoveRole = useCallback((role: string) => {
    setEditValues((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.filter((r) => r !== role),
    }))
  }, [])

  const toggleWorkplace = useCallback((type: string) => {
    setEditValues((prev) => ({
      ...prev,
      workplaceTypes: prev.workplaceTypes.includes(type)
        ? prev.workplaceTypes.filter((t) => t !== type)
        : [...prev.workplaceTypes, type],
    }))
  }, [])

  const toggleEmployment = useCallback((type: string) => {
    setEditValues((prev) => ({
      ...prev,
      employmentTypes: prev.employmentTypes.includes(type)
        ? prev.employmentTypes.filter((t) => t !== type)
        : [...prev.employmentTypes, type],
    }))
  }, [])

  const handleAddCustomLink = useCallback(() => {
    const newId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `link_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

    setEditValues((prev) => ({
      ...prev,
      customLinks: [...(prev.customLinks || []), { id: newId, label: "", url: "" }],
    }))
  }, [])

  const handleUpdateCustomLink = useCallback((id: string, field: "label" | "url", value: string) => {
    setEditValues((prev) => ({
      ...prev,
      customLinks: (prev.customLinks || []).map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    }))
  }, [])

  const handleRemoveCustomLink = useCallback((id: string) => {
    setEditValues((prev) => ({
      ...prev,
      customLinks: (prev.customLinks || []).filter((link) => link.id !== id),
    }))
  }, [])

  const handleResumeUpload = useCallback(async (file: File) => {
    // Client-side pre-validation: File Size (max 5MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setResumeUploadError("File size exceeds the 5MB limit. Please upload a smaller file.")
      return
    }

    // Client-side pre-validation: File Extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      setResumeUploadError("Invalid file type. Allowed formats: PDF, DOC, DOCX, ODT, RTF.")
      return
    }

    setResumeUploadError(null)
    setIsUploadingResume(true)

    try {
      const updated = await uploadResume(file)
      queryClient.setQueryData(PROFILE_QUERY_KEY, updated)
      setProfile(updated)
      setEditValues(updated)
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated))
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { errors?: { resume?: string[] }; message?: string } } }
      const serverMessage =
        errorObj.response?.data?.errors?.resume?.[0] ||
        errorObj.response?.data?.message ||
        "Failed to upload resume. Please try again."
      setResumeUploadError(serverMessage)
    } finally {
      setIsUploadingResume(false)
    }
  }, [queryClient, storageKey])

  const handleResumeDownload = useCallback(async () => {
    if (!profile.resumeFileName) return
    try {
      await downloadResume(profile.resumeFileName)
    } catch {
      setResumeUploadError("Failed to download resume. Please try again.")
    }
  }, [profile.resumeFileName])

  // Active data for live calculation and reactive feedback
  const activeData = isEditing ? editValues : profile

  // Calculate profile completeness score reactively
  const completenessPercent = useMemo(() => {
    const completenessItems = [
      Boolean(activeData.fullName?.trim()),
      Boolean(activeData.headline?.trim()),
      Boolean(activeData.bio?.trim()),
      Boolean(activeData.location?.trim()),
      Boolean(activeData.phone?.trim()),
      Boolean(activeData.targetRoles && activeData.targetRoles.length > 0),
      Boolean(activeData.workplaceTypes && activeData.workplaceTypes.length > 0),
      Boolean(activeData.employmentTypes && activeData.employmentTypes.length > 0),
      Boolean(activeData.targetSalary?.trim()),
      Boolean(
        activeData.linkedinUrl?.trim() ||
        activeData.githubUrl?.trim() ||
        activeData.portfolioUrl?.trim() ||
        (activeData.customLinks && activeData.customLinks.some((l) => Boolean(l.url?.trim())))
      ),
      Boolean(activeData.resumeFileName?.trim()),
    ]
    const completedCount = completenessItems.filter(Boolean).length
    return Math.round((completedCount / completenessItems.length) * 100)
  }, [activeData])

  const userInitials = useMemo(() => {
    return (activeData.fullName || user?.name || "User")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }, [activeData.fullName, user?.name])

  return {
    user,
    profile,
    editValues,
    setEditValues,
    isEditing,
    setIsEditing,
    newRoleInput,
    setNewRoleInput,
    saveSuccess,
    isUploadingResume,
    resumeUploadError,
    setResumeUploadError,
    updateMutation,
    activeData,
    completenessPercent,
    userInitials,
    handleSave,
    handleCancel,
    handleAddRole,
    handleRemoveRole,
    toggleWorkplace,
    toggleEmployment,
    handleAddCustomLink,
    handleUpdateCustomLink,
    handleRemoveCustomLink,
    handleResumeUpload,
    handleResumeDownload,
  }
}
