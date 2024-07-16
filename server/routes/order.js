const router = require("express").Router();
const Order = require("../models/order");
const verifyToken = require("../middlewares/verify-token");

// FOR CLIENT
router.get("/orders", verifyToken, async (req, res) => {
  try {
    let products = await Order.find({ owner: req.decoded._id })
      .populate({
        path: 'owner',
        populate: {
          path: 'address'
        },
      })
      .populate({
        path: 'products.productID',
        model: 'Product'
      })
      .populate({
        path: 'customProducts.customProductID',
        model: 'CustomOrder'
      })
      .exec();
    res.json({
      success: true,
      products: products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Single product for client
// FOR CLIENT
router.get("/orders/:id", verifyToken, async (req, res) => {
  try {
    let order = await Order.findOne({ owner: req.decoded._id, _id: req.params.id })
      .populate({
        path: 'owner',
        populate: {
          path: 'address'
        },
      })
      .populate({
        path: 'products.productID',
        model: 'Product'
      })
      .exec();
    res.json({
      success: true,
      order: order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// FOR ADMIN
router.get("/allorders", async (req, res) => {
  try {
    let products = await Order.find()
      .populate({
        path: 'owner',
        populate: {
          path: 'address'
        },
      })
      .populate({
        path: 'products.productID',
        model: 'Product'
      })
      .exec();

    res.json({
      success: true,
      products: products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// GET a single order
router.get("/allorders/:id", async (req, res) => {
  try {
    let order = await Order.findOne({ _id: req.params.id })
      .populate({
        path: 'owner',
        populate: {
          path: 'address'
        },
      })
      .populate({
        path: 'products.productID',
        model: 'Product'
      })
      .exec();

      res.json({
        success: true,
        order: order
      })
  } catch(err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  } 
})

module.exports = router;