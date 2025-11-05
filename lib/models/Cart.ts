import mongoose, { Document, Schema } from 'mongoose'

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId
  productId: mongoose.Types.ObjectId
  quantity: number
  addedAt: Date
}

const CartSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema)
