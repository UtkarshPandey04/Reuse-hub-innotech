import mongoose, { Document, Schema } from 'mongoose'

export interface IBadge extends Document {
  title: string
  description?: string
  iconUrl?: string
  createdAt: Date
}

const BadgeSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  iconUrl: { type: String },
}, {
  timestamps: true,
})

export default mongoose.models.Badge || mongoose.model<IBadge>('Badge', BadgeSchema)
