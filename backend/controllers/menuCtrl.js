const asyncHandler = require("express-async-handler");
const multer = require("multer");
const path = require("path");
const Menu = require("../model/Menu");
const Ad = require("../model/Ad");

// Set up multer for menu image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/menu_images"); // Folder where menu images will be stored
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const menuController = {
  // Create Menu and Associate with Ad
  createMenu: [
    upload.array("images", 5), // Allow up to 5 image uploads
    asyncHandler(async (req, res) => {
      const { adId, name, price } = req.body;
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

      // Create the menu
      const menu = await Menu.create({
        user: req.user._id,
        name,
        price,
        images, // Save the image paths
        ad: adId,
      });

      // Associate the menu with the ad
      ad.menus.push(menu._id);
      await ad.save();

      res.status(201).json({ message: "Menu created successfully", menu });
    }),
  ],
  //! Fetch All Menus
  getAllMenus: asyncHandler(async (req, res) => {
    const menus = await Menu.find();
    res.status(200).json(menus);
  }),

  //! Fetch Single Menu
  getMenu: asyncHandler(async (req, res) => {
    const { menuId } = req.params;
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }
    res.status(200).json(menu);
  }),

  //! Update Menu
  updateMenu: [
    upload.array("images", 5),
    asyncHandler(async (req, res) => {
      const { menuId } = req.params;
      const { name, price } = req.body; // price
      const menu = await Menu.findById(menuId);

      if (!menu) {
        return res.status(404).json({ message: "Menu not found" });
      }

      if (req.user._id.toString() !== menu.user.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Update menu fields
      menu.name = name || menu.name;
      menu.price = price || menu.price;

      // Update images if provided
      if (req.files) {
        const images = req.files.map((file) => file.path);
        menu.images = images;
      }

      await menu.save();
      res.status(200).json(menu);
    }),
  ],

  //! Delete Menu
  deleteMenu: asyncHandler(async (req, res) => {
    const { menuId } = req.params;
    const menu = await Menu.findById(menuId);

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    if (req.user._id.toString() !== menu.user.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await menu.remove();
    res.status(200).json({ message: "Menu deleted successfully" });
  }),
};

module.exports = menuController;
