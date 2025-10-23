import Order from '../models/Order.js';
import User from '../models/User.js';

export async function adminStats(req, res) {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const riders = await User.countDocuments({ role: 'rider' });
    const customers = await User.countDocuments({ role: 'customer' });
    res.json({ totalOrders, totalRevenue, riders, customers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
