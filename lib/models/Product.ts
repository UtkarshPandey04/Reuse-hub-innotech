import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
  sellerId: mongoose.Types.ObjectId
  title: string
  description?: string
  category?: string
  price: number
  imageUrl?: string
  rating: number
  reviewsCount: number
  quantity: number
  status: string
  createdAt: Date
  updatedAt: Date
}

const ProductSchema: Schema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  quantity: { type: Number, default: 1 },
  status: { type: String, default: 'available' },
}, {
  timestamps: true,
})

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
