const categoryController = require("../controllers/categoryController");
const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const { canAccess } = require("../middlewares/canAccess");

router.use(userAuth);
router
  .route("/")
  .post(
    canAccess("create-category-permission"),
    categoryController.createCategory
  )
  .get(
    canAccess("view-category-permission"),
    categoryController.getPaginatedCategories
  );

router
  .route("/:id")
  .patch(
    canAccess("update-category-permission"),
    categoryController.updateCategory
  )
  .get(canAccess("view-category-permission"), categoryController.getCategory)
  .delete(
    canAccess("delete-category-permission"),
    categoryController.deleteCategory
  );

router
  .route("/:id/subcategories")
  .get(
    canAccess("view-category-permission"),
    categoryController.getSubCategories
  );

module.exports = router;
