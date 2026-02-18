const { Role } = require("../models");


// CREATE ROLE
const createRole = async (req, res) => {
  try {
    const { role_name } = req.body;

    if (!role_name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const existing = await Role.findOne({ where: { role_name } });
    if (existing) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await Role.create({ role_name });

    return res.status(201).json({
      message: "Role created successfully",
      role,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// GET ALL ROLES
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();

    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// UPDATE ROLE
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await role.update({ role_name });

    return res.status(200).json({
      message: "Role updated successfully",
      role,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// DELETE ROLE
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await role.destroy();

    return res.status(200).json({
      message: "Role deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {createRole, updateRole, getAllRoles, deleteRole}