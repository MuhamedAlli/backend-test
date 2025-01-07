const Joi = require("joi");
const { Permission } = require("../models");
const { validateUniqueField } = require("./validateUniqueField");

exports.permissionValidate = Joi.object({
  name: Joi.string()
    .min(10)
    .required()
    .external(validateUniqueField(Permission, "name")),
});
