const { User, Role, Permission, RolePermission } = require("../models");

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Check if the 'superAdmin' role already exists
    const existingRole = await Role.findOne({ where: { name: "superAdmin" } });
    if (existingRole) {
      console.log("Seeding skipped: superAdmin role already exists.");
      return;
    }

    // Create the 'superAdmin' role
    const superAdminRole = await Role.create({ name: "superAdmin" });
    const userRole = await Role.create({ name: "user" });

    // Create a Super Admin user
    await User.create({
      name: "superAdmin",
      email: "superAdmin@gmail.com",
      password: "P@ssword",
      roleId: superAdminRole.id,
    });

    // Define tables and permissions
    const tables = ["user", "role", "permission", "category", "product"];
    const permissions = ["create", "update", "view", "delete"];

    // Generate permission entries
    const permissionEntries = [];
    for (const table of tables) {
      for (const action of permissions) {
        permissionEntries.push({
          name: `${action}-${table}-permission`,
          description: `Allow ${action} on ${table}`,
        });
      }
    }

    // Bulk insert permissions
    const createdPermissions = await Permission.bulkCreate(permissionEntries, {
      returning: true,
    });

    // Assign all permissions to the 'superAdmin' role
    const rolePermissionEntries = createdPermissions.map((permission) => ({
      roleId: superAdminRole.id,
      permissionId: permission.id,
    }));

    // Bulk insert role-permission associations
    await RolePermission.bulkCreate(rolePermissionEntries);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
}

module.exports = { seedDatabase };
