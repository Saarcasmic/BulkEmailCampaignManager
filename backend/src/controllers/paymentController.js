const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: 5 * 100, // amount in the smallest currency unit (5 USD = 500 cents)
      currency: 'USD',
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send('Some error occurred');
    
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: 'Transaction not legit!' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.subscription.status = 'active';
    user.subscription.plan = 'standard';
    user.subscription.subscribedAt = new Date();
    // Set subscription to end in one month.
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    user.subscription.subscriptionEndsAt = oneMonthFromNow;

    user.subscription.razorpayPaymentId = razorpay_payment_id;
    user.subscription.razorpayOrderId = razorpay_order_id;
    user.subscription.razorpaySignature = razorpay_signature;

    await user.save();

    res.json({
      message: 'Payment verified successfully',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during payment verification', error: error.message });
  }
}; 