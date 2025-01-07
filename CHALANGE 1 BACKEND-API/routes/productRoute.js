const productController = require("../controllers/productController");
const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const { canAccess } = require("../middlewares/canAccess");

router.post(
  "/",
  userAuth,
  canAccess("create-product-permission"),
  productController.uploadProductImage,
  productController.resizeProductImage,
  productController.createProduct
);

router.get("/", productController.getPaginatedProducts);

router.patch(
  "/:id",
  userAuth,
  canAccess("update-product-permission"),
  productController.uploadProductImage,
  productController.resizeProductImage,
  productController.updateProduct
);

router.get("/:id", productController.getProduct);

router.delete(
  "/:id",
  userAuth,
  canAccess("delete-product-permission"),
  productController.deleteProduct
);

module.exports = router;
