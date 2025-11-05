import mongoose, { Document, Schema } from 'mongoose'

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId
  type: string
  description: string
  metadata?: any
  createdAt: Date
}

const ActivitySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // 'login', 'purchase', 'challenge_completed', etc.
  description: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed }, // Additional data like product info, points earned, etc.
}, {
  timestamps: true,
})

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema)
