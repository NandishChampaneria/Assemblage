const router = require("express").Router();
const Product = require("../models/product");

const upload = require("../middlewares/upload-photo");

// POST - new product
router.post("/products", upload.array("photos", 100), async (req, res) => {
    try {
        let product = new Product();
        product.title = req.body.title;
        product.description = req.body.description;
        product.price = req.body.price;
        product.stockQuantity = req.body.stockQuantity;
        product.category = req.body.categoryID;
        product.photos = req.files.map(file => file.location);

        await product.save();

        res.json({
            status: true,
            message: "Successfully Saved"
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});


// GET - get all products
router.get("/products", async (req, res) => {
    try {
        let products = await Product.find().populate("category").exec();
        res.json({
            products: products,
            success: true
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// GET - get single product
router.get("/products/:id", async (req, res) => {
    try {
        let product = await Product.findOne({ _id: req.params.id }).populate("category").exec();
        res.json({
            product: product,
            success: true
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// PUT - update product
router.put("/products/:id", upload.single("photo"), async (req, res) => {
    try {
        let product = await Product.findOneAndUpdate(
            { _id: req.params.id }, 
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    price: req.body.price,
                    stockQuantity: req.body.stockQuantity,
                    category: req.body.categoryID,
                    photo: req.file.location
                }
            },
            { upsert: true }   
        );


        res.json({
            updatedProduct: product,
            success: true
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// DELETE - delete product
router.delete("/products/:id", async (req, res) => {
    try {
        let deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });

        if(deletedProduct) {
            res.json({
                status: true,
                message: "Successfully Deleted"
            });
        }
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


module.exports = router;

