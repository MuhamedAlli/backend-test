const Joi = require("joi");
const { User } = require("../models");
const { validateUniqueField } = require("./validateUniqueField");

const userSignupValidate = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string()
    .email()
    .required()
    .external(validateUniqueField(User, "email")),
  phone: Joi.string().external(validateUniqueField(User, "phone")),
  password: Joi.string().min(8).required(),
  address: Joi.string(),
  roleId: Joi.number().required(),
});

const userLoginValidate = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

module.exports = {
  userSignupValidate,
  userLoginValidate,
};
