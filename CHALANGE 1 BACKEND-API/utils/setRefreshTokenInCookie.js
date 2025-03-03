module.exports = (res, refreshToken, refreshTokenExpiresIn) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(refreshTokenExpiresIn),
  });
};
