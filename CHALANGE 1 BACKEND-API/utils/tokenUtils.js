const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { RefreshToken } = require("../models");

exports.generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  });
};

exports.generateRefreshToken = async (userId) => {
  const refreshToken = crypto.randomBytes(32).toString("hex");
  const refreshTokenEntity = await RefreshToken.create({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userId,
  });

  return refreshTokenEntity;
};

exports.correctPassword = async (candidatePassword, userHashedPassword) => {
  return await bcrypt.compare(candidatePassword, userHashedPassword);
};
