const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const { User } = require("../models");
const { Permission } = require("../models");
const { Role } = require("../models");

exports.userAuth = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  //2-verfication token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  //3-check if user still exists
  const currentUser = await User.findOne({
    where: { id: decoded.id },
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["id", "name"],
        include: [
          {
            model: Permission,
            as: "permissions",
            attributes: ["name"],
            through: { attributes: [] }, // Exclude the RolePermission junction table fields
          },
        ],
      },
    ],
  });

  if (!currentUser) {
    return next(
      new AppError(
        "The User belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser.toJSON();

  next();
});
