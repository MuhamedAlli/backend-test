const { Product } = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { ProductImage } = require("../models");
const multer = require("multer");
const sharp = require("sharp");
const {
  productCreateValidate,
  productUpdateValidate,
} = require("../validations/productValidation");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImage = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImage = catchAsync(async (req, res, next) => {
  console.log(req.body);

  if (!req.files.thumbnail || !req.files.images) return next();

  // 1) Thumbnail
  req.body.thumbnail = `product-${Date.now()}-thumbnail.jpeg`;
  await sharp(req.files.thumbnail[0].buffer)
    .resize(300, 300)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/products/thumbnails/${req.body.thumbnail}`);

  // 2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `product-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(800, 800)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const { images } = req.body;
  await productCreateValidate.validateAsync(req.body, { abortEarly: false });
  const newProduct = await Product.create(req.body);

  if (images) {
    const productImages = images.map((image) => ({
      productId: newProduct.id,
      url: image,
    }));
    await ProductImage.bulkCreate(productImages);
  }

  res.status(201).json({
    status: "success",
    data: { ...newProduct.toJSON(), images },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  await productUpdateValidate.validateAsync(req.body, { abortEarly: false });
  const product = await Product.findByPk(req.params.id);
  const { images } = req.body;
  if (!product) {
    return next(
      new AppError(`Product is not found with ${req.params.id} id`, 404)
    );
  }

  const updateProduct = await product.update(req.body);

  if (images) {
    await ProductImage.destroy({ where: { productId: req.params.id } });
    const productImages = images.map((image) => ({
      productId: req.params.id,
      url: image,
    }));
    await ProductImage.bulkCreate(productImages);
  }
  res.status(200).json({ status: "success", data: updateProduct });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return next(
      new AppError(`Product is not found with ${req.params.id} id`, 404)
    );
  }

  await product.destroy();

  res.status(204).json({ status: "success" });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findByPk(req.params.id, {
    include: { model: ProductImage, as: "images", attributes: ["id", "url"] },
  });
  if (!product) {
    return next(
      new AppError(`Product is not found with ${req.params.id} id`, 404)
    );
  }
  res.status(200).json({ status: "success", data: product });
});

exports.getPaginatedProducts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit; //rows will be skiped
  const { rows: products, count } = await Product.findAndCountAll({
    include: { model: ProductImage, as: "images", attributes: ["id", "url"] },
    limit,
    offset,
  });
  res.status(200).json({
    status: "success",
    results: products.length,
    data: products,
    totalCount: count,
    perPage: limit,
    currentPage: page,
  });
});
