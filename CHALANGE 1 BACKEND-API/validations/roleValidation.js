const Joi = require("joi");
const { Role } = require("../models");
const { validateUniqueField } = require("./validateUniqueField");

exports.roleCreateValidate = Joi.object({
  name: Joi.string()
    .min(5)
    .required()
    .external(validateUniqueField(Role, "name")),
  permissions: Joi.array().required(),
});

exports.roleUpdateValidate = Joi.object({
  name: Joi.string().min(5).external(validateUniqueField(Role, "name")),
  permissions: Joi.array(),
}).or("name", "permissions");
