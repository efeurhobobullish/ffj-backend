import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`, 'Content-Type': 'application/json' }
});

export async function initializePayment({ email, amount, reference, callback_url }) {
  const { data } = await api.post('/transaction/initialize', {
    email,
    amount: Math.round(amount * 100),
    reference,
    callback_url
  });
  return data;
}

export async function verifyPayment(reference) {
  const { data } = await api.get(`/transaction/verify/${reference}`);
  return data;
}
