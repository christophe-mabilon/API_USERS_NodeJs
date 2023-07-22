import db from "../models/index.js";
import responseErrors from "../middlewares/errorHandler.js";
const User = db.user;
const Role = db.role;

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
    await User.find().then(async (users) => {
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
        res.status(200).send(usersWithRoles);
        next();
      }
    });
  } catch (err) {
    responseErrors.responseUsersErrors(err, res);
  }
};

export const getAllUsersInfos = async (req, res) => {
  try {
    const users = await User.find();

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
    }
  } catch (err) {
    return responseErrors.responseUsersErrors(err, res);
  }
};

export const getUserInfos = async (req, res) => {
  try {
    const selectedUserId = req.params.id;
    const connectedUserId = req.auth.userId;
    const connectedUser = await User.findById(connectedUserId);
    const connectedRoleObject = await Role.findOne({
      _id: connectedUser.roles,
    });
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
    return responseErrors.responseUsersErrors(err, res);
  }
};

export const editUserInfos = async (req, res) => {
  try {
    const selectedUserId = req.params.id;
    const connectedUserId = req.auth.userId;
    const connectedUser = await User.findById(connectedUserId);
    const connectedRoleObject = await Role.findOne({
      _id: connectedUser.roles,
    });
    let connectedRole = connectedRoleObject.name.toUpperCase();
    let data = connectedUser;

    if (connectedRole === "SUPER-ADMIN") {
      data.roles.push(connectedRole);
    } else if (connectedRole === "ADMIN") {
      data.roles.push(connectedRole);
    } else if (
      connectedRole === "PROVIDER" &&
      selectedUserId === connectedUserId
    ) {
      data.roles.push(connectedRole);
    } else if (
      connectedRole === "CLIENT" &&
      selectedUserId === connectedUserId
    ) {
      data.roles.push(connectedRole);
    } else if (connectedRole === "NEW_USER") {
      return responseErrors.responseUsersErrors(401, res);
    }
    User.updateOne({ _id: selectedUserId }, { $set: data });
    return res
      .status(200)
      .send({ message: "Utilisateur modifié avec succès !" });
  } catch (err) {
    return responseErrors.responseUsersErrors(err, res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const selectedUserId = req.params.id;
    const connectedUserId = req.auth.userId;
    const connectedUser = await User.findById(connectedUserId);
    const connectedRoleObject = await Role.findOne({
      _id: connectedUser.roles,
    });
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
    responseErrors.responseUsersErrors(err, res);
  }
};

export const editRole = async (req, res) => {
  try {
    const selectedUserId = req.params.id;
    const connectedUserId = req.auth.userId;
    const connectedUser = await User.findById(connectedUserId);
    const connectedRoleObject = await Role.findOne({
      _id: connectedUser.roles,
    });
    let data = connectedUser;
    let connectedRole = connectedRoleObject.name.toUpperCase();
    if (connectedRole === "SUPER-ADMIN" && !data.includes(connectedRole)) {
      data.roles.push(connectedRole);
    } else if (connectedRole === "ADMIN" && !data.includes(connectedRole)) {
      data.roles.push(connectedRole);
    } else if (connectedRole === "PROVIDER" && !data.includes(connectedRole)) {
      data.roles.push(connectedRole);
    } else if (connectedRole === "CLIENT" && !data.includes(connectedRole)) {
      data.roles.push(connectedRole);
    } else if (connectedRole === "NEW_USER") {
      return responseErrors.responseUsersErrors(401, res);
    }
    User.updateOne({ _id: selectedUserId }, { $set: data });
    return res
      .status(200)
      .send({ message: "Utilisateur modifié avec succès !" });
  } catch (err) {
    responseErrors.responseUsersErrors(err, res);
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
    responseErrors.responseUsersErrors(err, res);
  }
};
