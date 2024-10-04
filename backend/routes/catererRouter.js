const express = require("express");
const isAuthenticated = require("../middlewares/isAuth");
const productController = require("../controllers/productsCtrl");
const menuController = require("../controllers/menuCtrl");

const catererRouter = express.Router();

//! Add Product to Ad or Menu
catererRouter.post(
  "/api/v1/products/add-product",
  isAuthenticated,
  productController.addProduct
);
//! Fetch All Products
catererRouter.get(
  "/api/v1/products",
  isAuthenticated,
  productController.getAllProducts
);

//! Fetch Single Product
catererRouter.get(
  "/api/v1/products/:productId",
  isAuthenticated,
  productController.getProduct
);

//! Update Product
catererRouter.put(
  "/api/v1/products/:productId",
  isAuthenticated,
  productController.updateProduct
);

//! Delete Product
catererRouter.delete(
  "/api/v1/products/:productId",
  isAuthenticated,
  productController.deleteProduct
);

//! Create Menu and associate it with Ad
catererRouter.post(
  "/api/v1/menus/create-menu",
  isAuthenticated,
  menuController.createMenu
);
//! Fetch All Menus
catererRouter.get("/api/v1/menus", isAuthenticated, menuController.getAllMenus);

//! Fetch Single Menu
catererRouter.get(
  "/api/v1/menus/:menuId",
  isAuthenticated,
  menuController.getMenu
);

//! Update Menu
catererRouter.put(
  "/api/v1/menus/:menuId",
  isAuthenticated,
  menuController.updateMenu
);

//! Delete Menu
catererRouter.delete(
  "/api/v1/menus/:menuId",
  isAuthenticated,
  menuController.deleteMenu
);

module.exports = catererRouter;
