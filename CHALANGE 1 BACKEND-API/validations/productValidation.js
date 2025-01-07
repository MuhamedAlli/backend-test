const joi = require("joi");

exports.productCreateValidate = joi.object({
  name: joi.string().min(3).max(100).required(),
  price: joi.number().required(),
  description: joi.string().min(5).max(255).optional(),
  quantity: joi.number().required().positive(),
  categoryId: joi.number().required(),
  thumbnail: joi.string().required().optional(),
  images: joi.array().items(joi.string()).optional(),
});

exports.productUpdateValidate = joi
  .object({
    name: joi.string().min(3).max(100).optional(),
    price: joi.number().optional(),
    description: joi.string().min(5).max(255).optional(),
    quantity: joi.number().positive().optional(),
    categoryId: joi.number().optional(),
    thumbnail: joi.string().optional(),
    images: joi.array().items(joi.string()).optional(),
  })
  .min(1);
