const { User, Role } = require("../models");
const { RefreshToken } = require("../models");
const catchAsync = require("../utils/catchAsync");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");
const { correctPassword } = require("../utils/tokenUtils");
const AppError = require("../utils/appError");
const setRefreshToken = require("../utils/setRefreshTokenInCookie");
const {
  userSignupValidate,
  userLoginValidate,
} = require("../validations/userValidation");

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  await userLoginValidate.validateAsync(req.body, {
    abortEarly: false,
  });

  const user = await User.findOne({
    where: { email },
    include: [{ model: RefreshToken, as: "refreshTokens" }],
    attributes: { include: ["id", "name", "email", "password"] },
  });

  if (!user || !(await correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  let refreshToken;
  let refreshTokenExpiresIn;
  const token = generateAccessToken(user.id);

  if (user.refreshTokens.some((token) => token.isActive)) {
    const refreshTokenEntity = user.refreshTokens.find(
      (token) => token.isActive
    );

    refreshToken = refreshTokenEntity.token;
    refreshTokenExpiresIn = refreshTokenEntity.expiresAt;
  } else {
    const newRefreshTokenEntity = await generateRefreshToken(user.id);
    refreshToken = newRefreshTokenEntity.token;
    refreshTokenExpiresIn = newRefreshTokenEntity.expiresAt;
  }

  if (refreshToken) {
    setRefreshToken(res, refreshToken, refreshTokenExpiresIn);
  }

  res.status(200).json({
    status: "success",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
    refreshTokenExpiresIn,
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const userRole = await Role.findOne({
    where: {
      name: "user",
    },
  });
  req.body.roleId = userRole.id;

  await userSignupValidate.validateAsync(req.body, {
    abortEarly: false,
  });

  const newUser = await User.create(req.body);
  const token = generateAccessToken(newUser.id);
  const refreshTokenEntity = await generateRefreshToken(newUser.id);

  setRefreshToken(res, refreshTokenEntity.token, refreshTokenEntity.expiresAt);

  const { password, ...data } = newUser.toJSON();
  res.status(201).json({
    status: "success",
    token,
    data,
    refreshTokenExpiresIn: refreshTokenEntity.expiresAt,
  });
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new AppError("Please provide refresh token", 400));
  }

  const user = await User.findOne({
    where: {},
    include: {
      model: RefreshToken,
      as: "refreshTokens",
      where: {
        token: refreshToken,
      },
      required: true,
    },
  });

  if (!user) {
    return next(new AppError("Invalid token!", 404));
  }

  const refreshTokenEntity = user.refreshTokens.find(
    (token) => token.token === refreshToken
  );

  if (!refreshTokenEntity || !refreshTokenEntity.isActive) {
    return next(new AppError("Inactive token!", 400));
  }
  await refreshTokenEntity.update({
    revokedAt: new Date(),
  });

  const newRefreshTokenEntity = await generateRefreshToken(user.id);
  const token = generateAccessToken(user.id);

  setRefreshToken(
    res,
    newRefreshTokenEntity.token,
    newRefreshTokenEntity.expiresAt
  );

  res.status(200).json({
    status: "success",
    token,
    refreshTokenExpiresIn: newRefreshTokenEntity.expiresAt,
  });
});

exports.revokeToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return next(new AppError("Token is required!", 400));
  }

  const user = await User.findOne({
    include: {
      model: RefreshToken,
      as: "refreshTokens",
      where: {
        token: refreshToken,
      },
      required: true,
    },
  });

  if (!user) {
    return next(new AppError("Invalid token!", 404));
  }

  const refreshTokenEntity = user.refreshTokens.find(
    (token) => token.token === refreshToken
  );

  if (!refreshTokenEntity || !refreshTokenEntity.isActive) {
    return next(new AppError("Inactive token!", 400));
  }

  await refreshTokenEntity.update({
    revokedAt: new Date(),
  });

  res.status(200).json({
    status: "success",
  });
});
