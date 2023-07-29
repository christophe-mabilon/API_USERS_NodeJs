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

async function getRole(userId) {
  const user = await User.findById(userId);
  return await Role.findOne({ _id: user.roles });
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
    const {
      page = req.page ? req.page : 1,
      perPage = req.perPage ? req.perPage : 10,
    } = req.query;

    const totalUsersCount = await User.countDocuments();
    const totalPages = Math.ceil(totalUsersCount / perPage);

    const users = await User.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (users.length !== 0) {
      const usersWithRoles = [];
      for (const user of users) {
        const roles = await getRole(user._id);
        usersWithRoles.push({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: roles.name,
        });
      }

      const response = {
        totalUsers: totalUsersCount,
        totalPages,
        currentPage: page,
        users: usersWithRoles,
      };

      res.status(200).json(response);
    } else {
      responseErrors.responseUsersErrors(404, res);
    }
  } catch (err) {
    responseErrors.responseUsersErrors(500, res);
  }
};

export const getAllUsersInfos = async (req, res) => {
  try {
    const { page, perPage } = req.query;

    const totalUsersCount = await User.countDocuments();
    const totalPages = Math.ceil(totalUsersCount / perPage);

    const users = await User.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (users.length !== 0) {
      const usersWithRoles = [];
      for (const element of users) {
        const user = element;
        const roles = await getRole(user._id);
        usersWithRoles.push({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: roles.name,
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

    const connectedRoleObject = await Role.findOne({
      _id: connectedUser.roles,
    });

    if (!connectedRoleObject) {
      return responseErrors.responseRoleErrors(404, res);
    }

    let connectedRole = connectedRoleObject.name.toUpperCase();
    if (
      connectedRole === "SUPER-ADMIN" ||
      connectedRole === "ADMIN" ||
      connectedRole === "PROVIDER" ||
      (connectedRole === "CLIENT" && selectedUserId === connectedUserId)
    ) {
      await getUser(req, res, selectedUserId);
    } else if (connectedRole === "NEW_USER") {
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
  try{
    const { username, email, roles } = req.body;

  // Find roles in the database
  const foundRoles = await Role.find({ name: { $in: roles } });

  // Update the user
 const user = await User.findOneAndUpdate(
    { username, email },
    { $addToSet: { roles: foundRoles.map(role => role._id) } },
    { new: true, useFindAndModify: false  }
  );

  if (!user) {
    return responseErrors.responseUsersErrors(404, res);
  }

  res.status(200).send({ message: 'User updated successfully', user });
  }catch(err){
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
    console.log(req.body);
    const roleName = req.body.role.toUpperCase();

    if (!connectedUser) {
      return responseErrors.responseUsersErrors(404, res);
    }

    const roleToAssign = await Role.findOne({ name: roleName });

    if (!roleToAssign) {
      return responseErrors.responseRoleErrors(404, res);
    }

    if (["SUPER-ADMIN", "ADMIN", "PROVIDER", "CLIENT"].includes(roleName)) {
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
    const selectedUserId = req.params.id;
    const connectedUserId = req.auth.userId;
    const connectedUser = await User.findById(connectedUserId);
    const connectedRoleObject = await Role.findOne({
      _id: connectedUser.roles,
    });
    let connectedRole = connectedRoleObject.name.toUpperCase();
    let data = connectedUser;
    if (connectedRole === "SUPER-ADMIN" && data.includes(connectedRole)) {
      data.roles = data.roles.filter((role) => role != "SUPER-ADMIN");
    } else if (connectedRole === "ADMIN" && data.includes(connectedRole)) {
      data.roles = data.roles.filter((role) => role != "ADMIN");
    } else if (connectedRole === "PROVIDER" && data.includes(connectedRole)) {
      data.roles = data.roles.filter((role) => role != "PROVIDER");
    } else if (connectedRole === "CLIENT" && data.includes(connectedRole)) {
      data.roles = data.roles.filter((role) => role != "CLIENT");
    } else if (connectedRole === "NEW_USER") {
      return responseErrors.responseUsersErrors(401, res);
    }
    User.updateOne({ _id: selectedUserId }, { $set: data });
    return res
      .status(200)
      .send({ message: "Utilisateur modifié avec succès !" });
  } catch (err) {
    responseErrors.responseUsersErrors(500, res);
  }
};
