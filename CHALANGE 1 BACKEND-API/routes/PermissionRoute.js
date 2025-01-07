const permissionController = require("../controllers/permissionController");
const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const { canAccess } = require("../middlewares/canAccess");

router.use(userAuth);
router
  .route("/")
  .post(
    canAccess("create-permission-permission"),
    permissionController.createPermission
  )
  .get(permissionController.getAllPermissions);

router
  .route("/:id")
  .patch(
    canAccess("update-permission-permission"),
    permissionController.updatePermission
  )
  .get(
    canAccess("view-permission-permission"),
    permissionController.getPermission
  )
  .delete(
    canAccess("delete-permission-permission"),
    permissionController.deletePermission
  );

module.exports = router;
