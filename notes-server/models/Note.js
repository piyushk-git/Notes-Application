import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,       // fast lookup by user
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      default: '',
      maxlength: [500000, 'Content is too long'],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: 'A note can have at most 20 tags',
      },
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    reminderAt: {
      type: Date,
      default: null,
    },
    weakTopics: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: 'At most 10 weak-topic tags per note',
      },
    },
    lastReviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

// Text index for full-text search (future feature)
noteSchema.index({ title: 'text', content: 'text' })

const Note = mongoose.model('Note', noteSchema)
export default Note
