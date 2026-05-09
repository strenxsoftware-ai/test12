
'use server';

import Razorpay from 'razorpay';

/**
 * @fileOverview Server actions for handling Razorpay transactions.
 */

const razorpay = new Razorpay({
  key_id: 'rzp_live_SiuQXDGuUvawLa',
  key_secret: 'SmpqNpLSuX2h3PXaJmUTyV3s',
});

export async function createRazorpayOrder(amount: number) {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    return { success: true, order };
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return { success: false, error: error.message };
  }
}
