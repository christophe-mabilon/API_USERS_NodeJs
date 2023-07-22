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

export const getAllTvByUser = async (req, res) => {
  try {
    const selectedUserId = req.params.userId;
    const selectedUser = await User.findById(selectedUserId);
    const userTv = selectedUser.tv;
    return res.status(200).send(userTv);
  } catch (err) {
    responseErrors.responseUsersErrors(err, res);
  }
};

export const addTVToUser = async (req, res) => {
  try {
    const selectedUserId = req.params.userId;
    const selectedUser = await User.findById(selectedUserId);

    const tvId = req.params.tvId;
    const selectedTv = await TV.findById(tvId);

    if (!selectedUser || !selectedTv) {
      responseErrors.responseUsersErrors(404, res);
    }

    // Check if the TV show is already in the user's TV array
    if (selectedUser.tv.includes(selectedTv._id)) {
      responseErrors.responseUsersErrors(400, res);
    }

    // Add the TV show ID to the user's TV array
    selectedUser.tv.push(selectedTv._id);

    // Save the updated user document
    await selectedUser.save();
    return res
      .status(200)
      .json({ message: "La série TV a été ajoutée avec succes!" });
  } catch (err) {
    responseErrors.responseUsersErrors(err, res);
  }
};

export const editTvUser = async (req, res) => {
  try {
    const selectedUserId = req.params.userId;
    const selectedUser = await User.findById(selectedUserId);

    const tvId = req.params.tvId;

    // Find the index of the TV show in the user's TV array
    const tvIndex = selectedUser.tv.findIndex((tv) => tv.equals(tvId));

    // Check if the TV show is associated with the user
    if (tvIndex === -1) {
      return res.status(404).json({ error: "TV show not found for the user." });
    }
    // Get the TV show object from the user's TV array
    const selectedTv = selectedUser.tv[tvIndex];

    const {
      id,
      name,
      original_name,
      overview,
      tagline,
      in_production,
      status,
      original_language,
      origin_country,
      created_by,
      first_air_date,
      last_air_date,
      number_of_episodes,
      number_of_seasons,
      production_companies,
      poster_path,
      vote_average,
      vote_count,
      popularity,
    } = req.body;

    if (id) tv.id = id;
    if (name) tv.name = name;
    if (original_name) tv.original_name = original_name;
    if (overview) tv.overview = overview;
    if (tagline) tv.tagline = tagline;
    if (in_production) tv.in_production = in_production;
    if (status) tv.status = status;
    if (original_language) tv.original_language = original_language;
    if (origin_country) tv.origin_country = origin_country;
    if (created_by) tv.created_by = created_by;
    if (first_air_date) tv.first_air_date = first_air_date;
    if (last_air_date) tv.last_air_date = last_air_date;
    if (number_of_episodes) tv.number_of_episodes = number_of_episodes;
    if (number_of_seasons) tv.number_of_seasons = number_of_seasons;
    if (production_companies) tv.production_companies = production_companies;
    if (poster_path) tv.poster_path = poster_path;
    if (vote_average) tv.vote_average = vote_average;
    if (vote_count) tv.vote_count = vote_count;
    if (popularity) tv.popularity = popularity;

    // Sauve data
    await tv.save();
    res.json({ message: "Série TV mis a jour avec succes" });
  } catch (err) {
    responseErrors.responseUsersErrors(err, res);
  }
};

export const deleteTvTuser = async (req, res) => {
  try {
    const selectedUserId = req.params.userId;
    const selectedUser = await User.findById(selectedUserId);

    const tvId = req.params.tvId;

    // Find the index of the TV show in the user's TV array
    const tvIndex = selectedUser.tv.findIndex((tv) => tv.equals(tvId));

    // Check if the TV show is associated with the user
    if (tvIndex === -1) {
      responseErrors.responseUsersErrors(404, res);
    }

    // Remove the TV show from the user's TV array
    selectedUser.tv.splice(tvIndex, 1);

    // Save the updated user document
    await selectedUser.save();

    return res.status(200).json({ message: "Série TV supprimé avec succes !" });
  } catch (err) {
    responseErrors.responseUsersErrors(err, res);
  }
};
