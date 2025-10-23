import Order from '../models/Order.js';
import Menu from '../models/Menu.js';

// Create order (customer)
export async function createOrder(req, res) {
  try {
    const { items = [], totalAmount, deliveryAddress } = req.body;
    if (!items.length) return res.status(400).json({ message: 'Items required' });
    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      deliveryAddress,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Customer fetch own orders; admin gets all
export async function listOrders(req, res) {
  try {
    if (req.user.role === 'admin') {
      const all = await Order.find().populate('userId').sort('-createdAt');
      return res.json(all);
    } else {
      const userOrders = await Order.find({ userId: req.user._id }).sort('-createdAt');
      return res.json(userOrders);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Rider accepts order
export async function riderAcceptOrder(req, res) {
  try {
    if (req.user.role !== 'rider') return res.status(403).json({ message: 'Riders only' });
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.riderId) return res.status(400).json({ message: 'Already assigned' });
    order.riderId = req.user._id;
    order.orderStatus = 'accepted';
    await order.save();
    // server will emit socket event in server.js when needed
    return res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Admin assign rider (alternative)
export async function adminAssignRider(req, res) {
  try {
    const { orderId } = req.params;
    const { riderId } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { riderId, orderStatus: 'accepted' }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Update order status (admin/rider)
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
