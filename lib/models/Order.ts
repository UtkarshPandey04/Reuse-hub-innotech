import mongoose, { Document, Schema } from 'mongoose'

export interface IOrder extends Document {
  buyerId: mongoose.Types.ObjectId
  sellerId: mongoose.Types.ObjectId
  productId: mongoose.Types.ObjectId
  quantity: number
  totalPrice?: number
  status: string
  pointsEarned: number
  createdAt: Date
}

const OrderSchema: Schema = new Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number },
  status: { type: String, default: 'pending' },
  pointsEarned: { type: Number, default: 0 },
}, {
  timestamps: true,
})

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
