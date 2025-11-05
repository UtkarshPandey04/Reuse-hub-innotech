import mongoose, { Document, Schema } from 'mongoose'

export interface IUserChallenge extends Document {
  userId: mongoose.Types.ObjectId
  challengeId: mongoose.Types.ObjectId
  progress: number
  completed: boolean
  startedAt: Date
  completedAt?: Date
}

const UserChallengeSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
})

export default mongoose.models.UserChallenge || mongoose.model<IUserChallenge>('UserChallenge', UserChallengeSchema)
