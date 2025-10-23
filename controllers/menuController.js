import Menu from '../models/Menu.js';

export async function listMenu(req, res) {
  const items = await Menu.find().sort('-createdAt');
  res.json(items);
}

export async function createMenuItem(req, res) {
  const { name, description, price, category, image_url, available } = req.body;
  const item = await Menu.create({ name, description, price, category, image_url, available });
  res.json(item);
}

export async function updateMenuItem(req, res) {
  const item = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
}

export async function deleteMenuItem(req, res) {
  await Menu.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}
