import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  username: string
  displayName?: string
  avatarUrl?: string
  bio?: string
  greenPoints: number
  co2Saved: number
  wasteDiverted: number
  badgesEarned: number
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  displayName: { type: String },
  avatarUrl: { type: String },
  bio: { type: String },
  greenPoints: { type: Number, default: 0 },
  co2Saved: { type: Number, default: 0 },
  wasteDiverted: { type: Number, default: 0 },
  badgesEarned: { type: Number, default: 0 },
}, {
  timestamps: true,
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
