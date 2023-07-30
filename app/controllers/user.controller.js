import db from "../models/index.js";
import responseErrors from "../middlewares/errorHandler.js";
const User = db.user;
const Role = db.role;
const TV = db.tv;

async function getUser(req, res, userId) {
  let user = await User.findById(userId);
  let roles = await Role.findOne({ _id: user.roles });
  res.status(200).send({
    id: user._id,
    username: user.username,
    email: user.email,
    roles: roles.name,
  });
}

async function getRoles(userId) {
  const user = await User.findById(userId).populate("roles");
  return user.roles;
}

async function addRoleToUser(userId, role) {
  const user = await User.findById(userId);
  user.roles.push(role);
}

/**
 * Recupération de la liste des utilisateur seul le super admin a acces a cette requete
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const getAllUsersInfosSuperAdminAccess = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;

    const totalUsersCount = await User.countDocuments();
    const totalPages = Math.ceil(totalUsersCount / perPage);

    const users = await User.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("roles"); // Populate roles

    if (users.length !== 0) {
      const usersWithRoles = [];
      for (const element of users) {
        const user = element;
        usersWithRoles.push({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles.map((role) => role.name), // Now you can access role.name
        });
      }
      return res.status(200).send(usersWithRoles);
    } else {
      responseErrors.responseUsersErrors(404, res);
    }
  } catch (err) {
    return responseErrors.responseUsersErrors(500, res);
  }
};

export const getAllUsersInfos = async (req, res) => {
  try {
    const { page, perPage } = req.query;

    const totalUsersCount = await User.countDocuments();
    const totalPages = Math.ceil(totalUsersCount / perPage);

    const users = await User.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("roles"); // Populate roles

    if (users.length !== 0) {
      const usersWithRoles = [];
      for (const element of users) {
        const user = element;
        usersWithRoles.push({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles.map((role) => role.name), // Now you can access role.name
        });
      }
      return res.status(200).send(usersWithRoles);
    } else {
      responseErrors.responseUsersErrors(404, res);
    }
  } catch (err) {
    return responseErrors.responseUsersErrors(500, res);
  }
};

export const getUserInfos = async (req, res) => {
  try {
    const selectedUserId = req.params.id;
    const connectedUserId = req.auth.userId;
    const connectedUser = await User.findById(connectedUserId);
    if (!connectedUser) {
      return responseErrors.responseUsersErrors(404, res);
    }

    const connectedRolesObjects = await Role.find({
      _id: { $in: connectedUser.roles },
    });

    if (!connectedRolesObjects) {
      return responseErrors.responseRoleErrors(404, res);
    }

    const connectedRoles = connectedRolesObjects.map((role) =>
      role.name.toUpperCase()
    );

    if (
      connectedRoles.includes("SUPER-ADMIN") ||
      connectedRoles.includes("ADMIN") ||
      connectedRoles.includes("PROVIDER") ||
      (connectedRoles.includes("CLIENT") && selectedUserId === connectedUserId)
    ) {
      await getUser(req, res, selectedUserId);
    } else if (connectedRoles.includes("NEW_USER")) {
      return responseErrors.responseUsersErrors(401, res);
    }
  } catch (err) {
    return responseErrors.responseUsersErrors(500, res);
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return responseErrors.responseUsersErrors(404, res);
    }

    // Return the user data
    return res.status(200).json({
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (err) {
    console.error(err);
    return responseErrors.responseUsersErrors(500, res);
  }
};

export const editUserInfos = async (req, res) => {
  try {
    const { username, email, roles } = req.body;

    // Find roles in the database
    const foundRoles = await Role.find({ name: { $in: roles } });

    // Update the user
    const user = await User.findOneAndUpdate(
      { username, email },
      { $addToSet: { roles: foundRoles.map((role) => role._id) } },
      { new: true, useFindAndModify: false }
    );

    if (!user) {
      return responseErrors.responseUsersErrors(404, res);
    }

    res.status(200).send({ message: "User updated successfully", user });
  } catch (err) {
    return responseErrors.responseUsersErrors(500, res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const selectedUserId = req.params.id;
    const connectedUserId = req.auth.userId;
    const connectedUser = await User.findById(connectedUserId);

    if (!connectedUser) {
      return responseErrors.responseUsersErrors(404, res);
    }

    const connectedRoleObject = await Role.findOne({
      _id: connectedUser.roles,
    });

    if (!connectedRoleObject) {
      return responseErrors.responseRoleErrors(404, res);
    }

    let connectedRole = connectedRoleObject.name.toUpperCase();

    if (connectedRole === "SUPER-ADMIN" || connectedRole === "ADMIN") {
      await User.findByIdAndDelete(selectedUserId);
      return res
        .status(200)
        .send({ message: "Utilisateur supprimé avec succès !" });
    } else if (
      (connectedRole === "PROVIDER" ||
        connectedRole === "CLIENT" ||
        connectedRole === "NEW_USER") &&
      selectedUserId === connectedUserId
    ) {
      return responseErrors.responseUsersErrors(401, res);
    }
  } catch (err) {
    responseErrors.responseUsersErrors(500, res);
  }
};

export const editRole = async (req, res) => {
  try {
    const selectedUserId = req.params.userId;
    const connectedUser = await User.findById(selectedUserId);
    const roleName = req.body.role;

    if (!connectedUser) {
      return responseErrors.responseUsersErrors(404, res);
    }

    const roleToAssign = await Role.findOne({ name: roleName });

    if (!roleToAssign) {
      return responseErrors.responseRoleErrors(404, res);
    }

    if (
      ["SUPER-ADMIN", "ADMIN", "PROVIDER", "CLIENT"].includes(
        roleName.toUpperCase()
      )
    ) {
      if (!connectedUser.roles.includes(roleToAssign._id)) {
        connectedUser.roles.push(roleToAssign._id);
        await connectedUser.save(); // Use Mongoose save() to update the user document
      }
    } else if (roleName === "NEW_USER") {
      return responseErrors.responseUsersErrors(401, res);
    }

    return res
      .status(200)
      .json({ message: "Utilisateur modifié avec succès !" });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeRole = async (req, res) => {
  try {
    const selectedUserId = req.params.userId;
    const roleToDelete = req.body.role;
    const user = await User.findById(selectedUserId).populate("roles");

    // Find the role to delete in the user's roles
    const roleObject = user.roles.find(
      (role) => role.name.toUpperCase() === roleToDelete.toUpperCase()
    );

    if (!roleObject) {
      return res
        .status(404)
        .send({ message: "Role not found in the user's roles" });
    }

    // Remove the role from the user's roles
    user.roles = user.roles.filter(
      (role) => role._id.toString() !== roleObject._id.toString()
    );

    // Save the user document
    await user.save();
    return res
      .status(200)
      .send({ message: "Utilisateur modifié avec succès !" });
  } catch (err) {
    responseErrors.responseUsersErrors(500, res);
  }
};
