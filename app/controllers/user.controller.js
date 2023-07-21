import db from "../models/index.js";

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
      } else {
        res.status(404).send({ message: "Aucun utilisateur trouvé !" });
      }
    });
  } catch (err) {
    res.status(500).send({
      message:
        "Vous n'avez pas le droit nésscesaire seul le super-admin peut consulter cette requete",
    });
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
      res.status(200).send(usersWithRoles);
    } else {
      res.status(404).send({ message: "Aucun utilisateur trouvé !" });
    }
  } catch (err) {
    res.status(500).send({
      message:
        "Vous n'avez pas le droit nésscesaire seul le admin peut consulter cette requete",
    });
  }
};

export const getUserInfos = async (req, res) => {
  const selectedUserId = req.params.id;
  const connectedUserId = req.auth.userId;
  const connectedUser = await User.findById(connectedUserId);
  const connectedRoleObject = await Role.findOne({ _id: connectedUser.roles });
  let connectedRole = connectedRoleObject.name.toUpperCase();
  if (connectedRole === "SUPER-ADMIN") {
    await getUser(req, res, selectedUserId);
  } else if (connectedRole === "ADMIN") {
    await getUser(req, res, selectedUserId);
  } else if (
    connectedRole === "PROVIDER" &&
    selectedUserId === connectedUserId
  ) {
    await getUser(req, res, selectedUserId);
  } else if (connectedRole === "CLIENT" && selectedUserId === connectedUserId) {
    await getUser(req, res, selectedUserId);
  } else if (connectedRole === "NEW_USER") {
    res.status(200).send({
      message: "Vous n'avez pas les droits pour accéder à cette page !",
    });
  }
};
export const editUserInfos = async (req, res) => {
  const selectedUserId = req.params.id;
  const connectedUserId = req.auth.userId;
  const connectedUser = await User.findById(connectedUserId);
  const connectedRoleObject = await Role.findOne({ _id: connectedUser.roles });
  let connectedRole = connectedRoleObject.name.toUpperCase();
  let data = req.body;

  if (connectedRole === "SUPER-ADMIN") {
    User.updateOne({ _id: selectedUserId }, { $set: data });
  } else if (connectedRole === "ADMIN") {
    User.updateOne({ _id: selectedUserId }, { $set: data });
  } else if (
    connectedRole === "PROVIDER" &&
    selectedUserId === connectedUserId
  ) {
    User.updateOne({ _id: selectedUserId }, { $set: data });
  } else if (connectedRole === "CLIENT" && selectedUserId === connectedUserId) {
    User.updateOne({ _id: selectedUserId }, { $set: data });
  } else if (connectedRole === "NEW_USER") {
    return res.status(200).send({
      message: "Vous n'avez pas les droits pour accéder à cette page !",
    });
  }
  return res.status(200).send({ message: "Utilisateur modifié avec succès !" });
};

export const deleteUser = async (req, res) => {
  const selectedUserId = req.params.id;
  const connectedUserId = req.auth.userId;
  const connectedUser = await User.findById(connectedUserId);
  const connectedRoleObject = await Role.findOne({ _id: connectedUser.roles });
  let connectedRole = connectedRoleObject.name.toUpperCase();

  if (connectedRole === "SUPER-ADMIN" || connectedRole === "ADMIN") {
    await User.findByIdAndDelete(selectedUserId);
    return res.status(200).send({ message: "Utilisateur supprimé avec succès !" });
  } else if (
    (connectedRole === "PROVIDER" || connectedRole === "CLIENT" || connectedRole === "NEW_USER") &&
    selectedUserId === connectedUserId
  ) {
    return res.status(403).send({
      message: "Vous n'avez pas les droits pour accéder à cette page !",
    });
  }

  return res.status(403).send({
    message: "Vous n'avez pas les droits pour supprimer cet utilisateur !",
  });
};

export const changeRole = (req, res) => {
  res.status(200).send("change Role");
};
