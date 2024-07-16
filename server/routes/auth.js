const router = require("express").Router();
const User = require("../models/user");
const AdminUser = require("../models/adminUser");
const verifyToken = require("../middlewares/verify-token");
const CustomOrder = require("../models/customOrder");
const jwt = require("jsonwebtoken");


/* Signup Route */
router.post("/auth/signup", async (req, res) => {
    if (!req.body.email || !req.body.password) {
      res.json({ success: false, message: "Please enter email or password" });
    } else {
      try {
        let newUser = new User();
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        await newUser.save();
        let token = jwt.sign(newUser.toJSON(), process.env.SECRET, {
          expiresIn: 604800 // 1 week
        });
  
        res.json({
          success: true,
          token: token,
          message: "Successfully created a new user"
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: err.message
        });
      }
    }
  });
  
  /* Profile Route */
  router.get("/auth/user", verifyToken, async (req, res) => {
    try {
      let foundUser = await User.findOne({ _id: req.decoded._id }).populate("address");
      if (foundUser) {
        res.json({
          success: true,
          user: foundUser
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  });

  /* get admin user */
  router.get("/auth/adminuser", verifyToken, async (req, res) => {
    try {
      let foundUser = await AdminUser.findOne({ _id: req.decoded._id });
      if (foundUser) {
        res.json({
          success: true,
          user: foundUser
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  });

/* update profile */
router.put("/auth/user", verifyToken, async (req, res) => {
  try {
    let foundUser = await User.findOne({ _id: req.decoded._id });

    if(foundUser) {
      if(req.body.name) foundUser.name = req.body.name;
      if(req.body.email) foundUser.email = req.body.email;
      if(req.body.password) foundUser.password = req.body.password;

      await foundUser.save();

      res.json({
        success: true,
        message: "Successfully updated"
      })
    }
  } catch(err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// User cart get
  router.get("/cart", verifyToken, async (req, res) => {
    try {
      let foundUser = await User.findOne({ _id: req.decoded._id })
        .populate({
          path: 'cart',
          populate: [
            {
              path: 'products.product',
              model: 'Product'
            },
            {
              path: 'customProducts.customProduct',
              model: 'CustomOrder'
            }
          ]
        })
        .exec();
      if (foundUser) {
        res.json({
          success: true,
          cart: foundUser.cart
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  });

  router.post("/cart", verifyToken, async (req, res) => {
    try {
        const userId = req.decoded._id;
        const { productID, isCustomProduct, customProductData } = req.body;
        const defaultQuantity = parseInt(1); // Default to 1 if quantity is not provided
        const quantity = parseInt(req.body.quantity);

        // Find the user
        let foundUser = await User.findById(userId);

        if (!foundUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let productType = "products";
        if (isCustomProduct) {
            productType = "customProducts";
        }

        let productExists = false;
        // Check if productID is defined and foundUser.cart is an array
        if (productID && Array.isArray(foundUser.cart)) {
            // Loop through each cart entry
            for (let cartItem of foundUser.cart) {
                const products = cartItem[productType]; // Get the array of products or customProducts
                if (products) {
                    const existingProductIndex = products.findIndex(item =>
                        item.product && item.product.toString() === productID
                    );
                    if (existingProductIndex !== -1) {
                        // If product exists, increment its quantity
                        products[existingProductIndex].quantity += quantity || defaultQuantity; // Add custom quantity here
                        productExists = true;
                        break;
                    }
                }
            }
        }

        if (!productExists && !isCustomProduct) {
            // If the product doesn't exist in any cart entry and it's not a custom product, add it with the custom quantity
            const newProduct = { product: productID, quantity };
            foundUser.cart.push({ products: [newProduct] });
        } else if (!productExists && isCustomProduct) {
            const newCustomProduct = await CustomOrder.create({...customProductData, owner: userId});
            const customProduct = { customProduct: newCustomProduct._id, customQuantity: quantity || defaultQuantity };
            foundUser.cart.push({ customProducts: [customProduct] });
        }

        // Save the updated user document
        await foundUser.save();

        res.json({
            success: true,
            message: "Successfully Added to Cart"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});



router.delete("/cart/:productId", verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the user
    const foundUser = await User.findOne({ _id: req.decoded._id });
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Find the cart item that contains the product to be deleted
    const cartItemIndex = foundUser.cart.findIndex(item =>
      item.products.some(product => product.product.toString() === productId)
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in any cart item"
      });
    }

    // Remove the cart item from the user's cart
    foundUser.cart.splice(cartItemIndex, 1);

    // Save the changes to the user's cart
    await foundUser.save();

    res.json({
      success: true,
      message: "Product removed from cart"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

router.delete("/custom/cart/:customProductId", verifyToken, async (req, res) => {
  try {
    const { customProductId } = req.params;

    // Find the user
    const foundUser = await User.findOne({ _id: req.decoded._id });
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Find the cart item that contains the custom product to be deleted
    const cartItemIndex = foundUser.cart.findIndex(item =>
      item.customProducts.some(customProduct => customProduct.customProduct.toString() === customProductId)
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Custom product not found in any cart item"
      });
    }

    foundUser.cart.splice(cartItemIndex, 1);

    // Save the changes to the user's cart
    await foundUser.save();

    res.json({
      success: true,
      message: "Custom product removed from cart"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// Route to clear the cart
router.delete('/cart', verifyToken, async (req, res) => {
  try {
      const userId = req.decoded._id;

      // Find the user by ID
      const foundUser = await User.findById(userId);

      if (!foundUser) {
          return res.status(404).json({
              success: false,
              message: "User not found"
          });
      }

      // Clear the cart array
      foundUser.cart = [];

      // Save the updated user document
      await foundUser.save();

      res.json({
          success: true,
          message: "Cart cleared successfully"
      });
  } catch (err) {
      console.error("Error clearing cart:", err);
      res.status(500).json({
          success: false,
          message: "Failed to clear cart"
      });
  }
});


/* Login Route */
router.post("/auth/login", async (req, res) => {
  try {
    let foundUser = await User.findOne({ email: req.body.email });
    if(!foundUser) {
      res.status(403).json({
        success: false,
        message: "Authentication failed, user not found"
      })
    } else {
      if(foundUser.comparePassword(req.body.password)) {
        let token = jwt.sign(foundUser.toJSON(), process.env.SECRET, {
          expiresIn: 604800
        })

        res.json({
          success: true,
          token: token
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Authentication failed, wrong password"
        });
      }
    }
  } catch(err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

/* ADMIN Login Route */
router.post("/auth/adminlogin", async (req, res) => {
  try {
    let foundUser = await AdminUser.findOne({ adminEmail: req.body.email });
    if(!foundUser) {
      res.status(403).json({
        success: false,
        message: "Authentication failed, user not found"
      })
    } else {
      if(foundUser.comparePassword(req.body.password)) {
        let token = jwt.sign(foundUser.toJSON(), process.env.SECRET_ADMIN, {
          expiresIn: 604800
        })

        res.json({
          success: true,
          token: token
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Authentication failed, wrong password"
        });
      }
    }
  } catch(err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

/* ADMIN Signup Route */
router.post("/auth/adminsignup", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({ success: false, message: "Please enter email or password" });
  } else {
    try {
      let newAdminUser = new AdminUser();
      newAdminUser.name = req.body.name;
      newAdminUser.adminEmail = req.body.email;
      newAdminUser.password = req.body.password;
      await newAdminUser.save();
      let token = jwt.sign(newAdminUser.toJSON(), process.env.SECRET_ADMIN, {
        expiresIn: 604800 // 1 week
      });

      res.json({
        success: true,
        token: token,
        message: "Successfully created a new user"
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
});

module.exports = router;