import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export async function signup(req, res) {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, phone, password: hashed, role: 'customer' });
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Admin adds rider
export async function createRiderByAdmin(req, res) {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email exists' });
    const hashed = await bcrypt.hash(password, 10);
    const rider = await User.create({ fullName, email, phone, password: hashed, role: 'rider' });
    res.json({ rider: { id: rider._id, email: rider.email, fullName: rider.fullName } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
