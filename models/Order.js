import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
  name: String,
  quantity: Number,
  price: Number
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  totalAmount: Number,
  deliveryAddress: String,
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending','accepted','preparing','on_the_way','delivered','cancelled'], default: 'pending' },
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  riderLocation: {
    lat: Number,
    lng: Number,
    updatedAt: Date
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
