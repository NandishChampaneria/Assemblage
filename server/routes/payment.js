const router = require("express").Router();
const Razorpay = require("razorpay");
const verifyToken = require("../middlewares/verify-token");
const Order = require("../models/order");
const CustomOrder = require("../models/customOrder");

// Initialize Razorpay instance with your API key and secret
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post("/payment", verifyToken, async (req, res) => {
    try {
        const totalPrice = Math.round(req.body.totalPrice * 100);
        const products = req.body.products

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: totalPrice,
            currency: "INR", // Assuming you are using Indian Rupee
            payment_capture: 1 // Automatically capture payment when order is created
        });

        const orderId = order.id;

        const regularProducts = products.filter(product => !product.customProductId);
        const customProducts = products.filter(product => product.customProductId);

        // Save the order details to your database
        const newOrder = new Order({
            products: regularProducts.map(product => ({
                productID: product.productId,
                quantity: parseInt(product.quantity),
                price: product.price
            })),
            customProducts: customProducts.map(product => ({
                customProductID: product.customProductId,
                quantity: parseInt(product.quantity),
                price: product.price
            })),
            owner: req.decoded._id,
            estimatedDelivery: req.body.estimatedDelivery,
            razorpayOrderId: orderId ,// Save Razorpay order ID to reference it later
            date: req.body.date,
            time: req.body.time,
            total: req.body.totalPrice
        });
        await newOrder.save();

        // Send the Razorpay order ID to the client
        res.json({
            success: true,
            orderId: orderId
        });
    } catch (err) {
        console.error("Error processing payment:", err);
        res.status(500).json({
            success: false,
            message: "Failed to process payment"
        });
    }
});

module.exports = router;
