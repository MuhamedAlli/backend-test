const { roleCreateValidate } = require("../validations/roleValidation");
const { roleUpdateValidate } = require("../validations/roleValidation");
const { Role } = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createRole = catchAsync(async (req, res, next) => {
  await roleCreateValidate.validateAsync(req.body, {
    abortEarly: false,
  });
  const newRole = await Role.create(req.body);

  if (req.body.permissions) {
    await newRole.addPermissions(req.body.permissions);
  }

  res.status(201).json({
    status: "success",
    data: newRole,
  });
});

exports.updateRole = catchAsync(async (req, res, next) => {
  await roleUpdateValidate.validateAsync(req.body, {
    abortEarly: false,
  });

  const role = await Role.findByPk(req.params.id);

  if (!role) {
    return next(
      new AppError(`Role is not found with ${req.params.id} id`, 404)
    );
  }

  let updateRole = await role.update(req.body);

  if (req.body.permissions) {
    await role.setPermissions(req.body.permissions);
  }

  res.status(200).json({ status: "success", data: updateRole });
});

exports.getRole = catchAsync(async (req, res, next) => {
  let role = await Role.findByPk(req.params.id);
  if (!role) {
    return next(
      new AppError(`Role is not found with ${req.params.id} id`, 404)
    );
  }

  res.status(200).json({ status: "success", data: role });
});

exports.getPaginatedRoles = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit; //rows will be skiped
  const { rows: roles, count } = await Role.findAndCountAll({
    limit,
    offset,
  });

  const pageCount = Math.ceil(count / limit);

  res.status(200).json({
    status: "success",
    data: roles,
    totalCount: count,
    pageCount,
    perPage: limit,
    currentPage: page,
  });
});

exports.deleteRole = catchAsync(async (req, res, next) => {
  const role = await Role.findByPk(req.params.id);

  if (!role) {
    return next(
      new AppError(`Role is not found with ${req.params.id} id`, 404)
    );
  }

  await role.destroy();

  res.status(204).json({ status: "success" });
});
