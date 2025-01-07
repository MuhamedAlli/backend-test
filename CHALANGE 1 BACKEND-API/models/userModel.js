"use strict";
const { Model } = require("sequelize");
const { hashText } = require("../utils/bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { as: "role", foreignKey: "roleId" });

      User.hasMany(models.RefreshToken, {
        as: "refreshTokens",
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          if (value) {
            const hashedPass = hashText(value);
            this.setDataValue("password", hashedPass);
          }
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Role", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    }
  );

  return User;
};
