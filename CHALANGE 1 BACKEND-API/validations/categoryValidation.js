const Joi = require("joi");
const { Category } = require("../models");
const { validateUniqueField } = require("./validateUniqueField");

exports.categoryCreateValidate = Joi.object({
  name: Joi.string().min(3).required(),
  slug: Joi.string()
    .min(5)
    .max(50)
    .required()
    .external(validateUniqueField(Category, "slug")),
  parentCategoryId: Joi.number().optional(),
});

exports.categoryUpdateValidate = Joi.object({
  name: Joi.string().min(3).required(),
  slug: Joi.string()
    .min(5)
    .max(50)
    .required()
    .external(validateUniqueField(Category, "slug")),
  parentCategoryId: Joi.number(),
}).or("name", "slug", "parentCategoryId");
