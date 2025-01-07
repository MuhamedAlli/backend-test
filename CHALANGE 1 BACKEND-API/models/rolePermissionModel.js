"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {}
  RolePermission.init(
    {
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Role", key: "id" },
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Permission", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
      tableName: "role_permissions",
      timestamps: false,
    }
  );

  return RolePermission;
};
