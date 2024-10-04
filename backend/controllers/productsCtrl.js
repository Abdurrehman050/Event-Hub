const asyncHandler = require("express-async-handler");
const multer = require("multer");
const path = require("path");
const Product = require("../model/Product");
const Ad = require("../model/Ad");
const Menu = require("../model/Menu");

// Set up multer for product image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/product_images"); // Folder where product images will be stored
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const productController = {
  // Add Product to Ad or Menu
  addProduct: [
    upload.array("images", 5), // Allow up to 5 image uploads
    asyncHandler(async (req, res) => {
      const { adId, menuId, name, foodType, price } = req.body;
      const ad = await Ad.findById(adId);

      // Check if the ad exists and belongs to the user
      if (
        !ad ||
        ad.user.toString() !== req.user._id.toString() ||
        ad.type !== "caterer"
      ) {
        return res.status(400).json({
          message: "Invalid Ad or not a Caterer Ad, or you're not authorized",
        });
      }

      // Process the images
      const images = req.files.map((file) => file.path); // Save the paths of the uploaded images

      // Create the product
      const product = await Product.create({
        user: req.user._id,
        name,
        foodType,
        price,
        images, // Save the image paths
        ad: adId,
      });

      // Associate the product with the ad
      ad.products.push(product._id);
      await ad.save();

      // Optionally associate the product with a menu
      if (menuId) {
        const menu = await Menu.findById(menuId);
        if (!menu || menu.user.toString() !== req.user._id.toString()) {
          return res
            .status(400)
            .json({ message: "Menu not found or you're not authorized" });
        }
        menu.products.push(product._id);
        await menu.save();

        product.menu = menuId;
        await product.save();
      }

      res.status(201).json({ message: "Product added successfully", product });
    }),
  ],
  //! Fetch All Products
  getAllProducts: asyncHandler(async (req, res) => {
    const products = await Product.find();
    res.status(200).json(products);
  }),

  //! Fetch Single Product
  getProduct: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  }),

  //! Update Product
  updateProduct: [
    upload.array("images", 5),
    asyncHandler(async (req, res) => {
      const { productId } = req.params;
      const { name, foodType, price } = req.body;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (req.user._id.toString() !== product.user.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Update product fields
      product.name = name || product.name;
      product.foodType = foodType || product.foodType;
      product.price = price || product.price;

      // Update images if provided
      if (req.files) {
        const images = req.files.map((file) => file.path);
        product.images = images;
      }

      await product.save();
      res.status(200).json(product);
    }),
  ],

  //! Delete Product
  deleteProduct: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.user._id.toString() !== product.user.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.remove();
    res.status(200).json({ message: "Product deleted successfully" });
  }),
};

module.exports = productController;
