import { z } from 'zod'

// ── Auth ───────────────────────────────────────────
export const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters').max(80),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const optionalDateOrNull = z
  .union([z.string(), z.number(), z.date(), z.null()])
  .optional()
  .transform((v) => {
    if (v === null || v === '') return null
    if (v === undefined) return undefined
    const d = v instanceof Date ? v : new Date(v)
    return Number.isNaN(d.getTime()) ? null : d
  })

// ── Notes ──────────────────────────────────────────
export const createNoteSchema = z.object({
  title:   z.string().min(1, 'Title is required').max(200),
  content: z.string().max(500000).optional().default(''),
  tags:    z.array(z.string().trim().max(30)).max(20).optional().default([]),
  isPinned: z.boolean().optional().default(false),
  reminderAt: optionalDateOrNull,
  weakTopics: z.array(z.string().trim().max(40)).max(10).optional().default([]),
  lastReviewedAt: optionalDateOrNull,
})

export const updateNoteSchema = z.object({
  title:   z.string().min(1).max(200).optional(),
  content: z.string().max(500000).optional(),
  tags:    z.array(z.string().trim().max(30)).max(20).optional(),
  isPinned: z.boolean().optional(),
  reminderAt: optionalDateOrNull,
  weakTopics: z.array(z.string().trim().max(40)).max(10).optional(),
  lastReviewedAt: optionalDateOrNull,
})
