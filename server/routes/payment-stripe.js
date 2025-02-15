const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const verifyToken = require("../middlewares/verify-token");
const Order = require("../models/order");

router.post("/payment", verifyToken, (req, res) => {
    let totalPrice = Math.round(req.body.totalPrice * 100);
    stripe.customers.create({
        email: req.decoded.email
    }).then(customer => {
        return stripe.customers.createSource(customer.id, {
            source: "tok_visa"
        });
    }).then(source => {
        return stripe.charges.create({
            amount: totalPrice,
            currency: "usd",
            customer: source.customer
        })
    }).then(async charge => {
        let order = new Order();
        let cart = req.body.cart;

        cart.map(product => {
            order.products.push({
                productID: product._id,
                quantity: parseInt(product.quantity),
                price: product.price
            });
        });

        order.owner = req.decoded._id;
        order.estimatedDelivery = req.body.estimatedDelivery;
        await order.save();

        res.json({
            success: true,
            message: "Successfully made a payment"
        })

    }).catch(err => {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        })
    })
});

module.exports = router;