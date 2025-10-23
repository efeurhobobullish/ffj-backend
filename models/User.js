import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: String,
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: String, // hashed
  avatar: String,
  role: { type: String, enum: ['customer','rider','admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
