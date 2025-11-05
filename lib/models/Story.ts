import mongoose, { Document, Schema } from 'mongoose'

export interface IStory extends Document {
  authorId: mongoose.Types.ObjectId
  title: string
  content: string
  imageUrl?: string
  likes: number
  views: number
  createdAt: Date
  updatedAt: Date
}

const StorySchema: Schema = new Schema({
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
}, {
  timestamps: true,
})

export default mongoose.models.Story || mongoose.model<IStory>('Story', StorySchema)
