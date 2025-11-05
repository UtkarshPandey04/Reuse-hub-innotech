import mongoose, { Document, Schema } from 'mongoose'

export interface IChallenge extends Document {
  title: string
  description?: string
  durationDays: number
  rewardPoints: number
  difficulty: string
  category?: string
  participants: number
  createdAt: Date
}

const ChallengeSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  durationDays: { type: Number },
  rewardPoints: { type: Number },
  difficulty: { type: String },
  category: { type: String },
  participants: { type: Number, default: 0 },
}, {
  timestamps: true,
})

export default mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema)
