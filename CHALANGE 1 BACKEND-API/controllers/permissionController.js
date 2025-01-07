const { permissionValidation } = require("../validations/permissionValidation");
const { Permission } = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createPermission = catchAsync(async (req, res, next) => {
  await permissionValidation.validateAsync(req.body, {
    abortEarly: false,
  });

  const newPerm = await Permission.create(req.body);
  res.status(201).json({
    status: "success",
    data: newPerm,
  });
});

exports.updatePermission = catchAsync(async (req, res, next) => {
  await permissionValidation.validateAsync(req.body, {
    abortEarly: false,
  });

  const perm = await Permission.findByPk(req.params.id);

  if (!perm) {
    return next(
      new AppError(`Permission is not found with ${req.params.id} id`, 404)
    );
  }

  let updatePerm = await perm.update(req.body);
  res.status(200).json({ status: "success", data: updatePerm });
});

exports.getPermission = catchAsync(async (req, res, next) => {
  let perm = await Permission.findByPk(req.params.id);
  if (!perm) {
    return next(
      new AppError(`Permission is not found with ${req.params.id} id`, 404)
    );
  }

  res.status(200).json({ status: "success", data: perm });
});

exports.getAllPermissions = catchAsync(async (req, res, next) => {
  const perms = await Permission.findAll();
  res.status(200).json({
    status: "success",
    data: perms,
  });
});

exports.deletePermission = catchAsync(async (req, res, next) => {
  const perm = await Permission.findByPk(req.params.id);

  if (!perm) {
    return next(
      new AppError(`Permission is not found with ${req.params.id} id`, 404)
    );
  }

  await perm.destroy();

  res.status(204).json({ status: "success" });
});
