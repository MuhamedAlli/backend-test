"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      // Correct the association with the User model
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        targetKey: "id",
      });
    }
  }

  RefreshToken.init(
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.VIRTUAL,
        get() {
          return (
            !(new Date() >= this.expiresAt) &&
            this.getDataValue("revokedAt") === null
          );
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "User", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      modelName: "RefreshToken",
      tableName: "refresh_tokens",
      sequelize,
    }
  );

  return RefreshToken;
};
