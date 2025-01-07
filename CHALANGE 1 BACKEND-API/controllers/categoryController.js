const { Category } = require("../models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { categoryCreateValidate } = require("../validations/categoryValidation");

exports.createCategory = catchAsync(async (req, res, next) => {
  await categoryCreateValidate.validateAsync(req.body, {
    abortEarly: false,
  });
  const newCategory = await Category.create(req.body);
  res.status(201).json({
    status: "success",
    data: newCategory,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    return next(
      new AppError(`Category is not found with ${req.params.id} id`, 404)
    );
  }

  let updateCategory = await category.update(req.body);
  res.status(200).json({ status: "success", data: updateCategory });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    return next(
      new AppError(`Category is not found with ${req.params.id} id`, 404)
    );
  }

  await category.destroy();

  res.status(204).json({ status: "success" });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  let category = await Category.findByPk(req.params.id);
  if (!category) {
    return next(
      new AppError(`Category is not found with ${req.params.id} id`, 404)
    );
  }

  res.status(200).json({ status: "success", data: category });
});

exports.getPaginatedCategories = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit; //rows will be skiped
  const { rows: categories, count } = await Category.findAndCountAll({
    limit,
    offset,
  });

  res.status(200).json({
    status: "success",
    data: categories,
    totalCount: count,
    perPage: limit,
    currentPage: page,
  });
});

exports.getSubCategories = catchAsync(async (req, res, next) => {
  let category = await Category.findByPk(req.params.id, {
    include: [{ model: Category, as: "subCategories" }],
  });

  if (!category) {
    return next(
      new AppError(`Category is not found with ${req.params.id} id`, 404)
    );
  }

  res.status(200).json({ status: "success", data: category.subCategories });
});
