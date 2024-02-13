import { razorpayInstance } from "../index.js";
import crypto from "crypto";
import Payment from "../modals/Payment.js";

export async function payment(req, res) {
    try {
      const options = {
        amount: Number(req.body.TotalSum * 100),
        currency: "INR",
      };
      const order = await razorpayInstance.orders.create(options);
      console.log("After creating Razorpay order", order);
      res.status(200).json({ success: true, order });
  } catch (error) {
      console.error("Error processing payment:", error.message);
      res.status(500).json({ success: false, error: error.message });
  }
}

export async function paymentVerification(req, res) {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
  
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const razorpaySecret = process.env.RAZORPAY_API_SECRET_KEY;
        console.log("Razorpay Secret:", razorpaySecret);
  
    const expectedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(body.toString())
      .digest("hex");
  
    const isAuthentic = expectedSignature === razorpay_signature;
  
    if (isAuthentic) {
      // Database comes here
  
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
  
      res.redirect(
        `/order-sucess/${razorpay_payment_id}`
      );
    } else {
      res.status(400).json({
        success: false,
      });
    }
}