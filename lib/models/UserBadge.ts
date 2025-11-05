import mongoose, { Document, Schema } from 'mongoose'

export interface IUserBadge extends Document {
  userId: mongoose.Types.ObjectId
  badgeId: mongoose.Types.ObjectId
  earnedAt: Date
}

const UserBadgeSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  badgeId: { type: Schema.Types.ObjectId, ref: 'Badge', required: true },
  earnedAt: { type: Date, default: Date.now },
})

export default mongoose.models.UserBadge || mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema)
