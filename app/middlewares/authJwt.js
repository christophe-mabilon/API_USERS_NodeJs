import jwt from "jsonwebtoken";
import db from "../models/index.js";
import dotenv from "dotenv";
import { responseJwtErrors } from "../middlewares/errorHandler.js";

dotenv.config();
const User = db.user;
const Role = db.role;

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1y",
  });
}

const verifyToken = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (token) {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decodedToken.id;
      req.auth = {
        userId: userId,
      };
      next();
    } else {
      responseJwtErrors(401,res);
    }
  } catch (err) {
    responseJwtErrors(err,res);
  }
};

const isSuperAdmin = async (req, res, next) => {
  const definedRole = "super-admin";
  const userId = req.auth.userId;
  try {
    const user = await User.findById(userId);
    const role = await Role.findOne({ _id: user.roles[0] });
    if (role.name.toUpperCase() === definedRole.toUpperCase()) {
      next();
    }
  } catch (err) {
    switch (err.status) {
      case 401:
        return err.status(401).send({ message: "Non autorisé !" });
      case 403:
        return res
          .status(403)
          .send({ message: `Nécessite le rôle de ${definedRole} !` });
      case 404:
        return res
          .status(404)
          .send({ message: `Nécessite le rôle de ${definedRole} !` });
      default:
        return res.status(500).send({ message: `$Erreur ${err.statusCode} !` });
    }
  }
};

const isAdmin = async (req, res, next) => {
  const parentRole = "super-admin";
  const definedRole = "admin";

  const userId = req.auth.userId;
  try {
    const user = await User.findById(userId);
    const role = await Role.findOne({ _id: user.roles[0] });
    if (
      role.name.toUpperCase() === definedRole.toUpperCase() ||
      role.name.toUpperCase() === parentRole
    ) {
      return next();
    }
    switch (err.status) {
      case 403:
        return res
          .status(403)
          .send({ message: `Nécessite le rôle de ${definedRole} !` });
      case 401:
        return res.status(401).send({ message: "Non autorisé !" });
      default:
        return res.status(500).send({ message: `$Erreur ${res.statusCode} !` });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

const isClient = async (req, res, next) => {
  const definedRole = "client";
  const userId = req.auth.userId;
  try {
    const user = await User.findById(userId);
    const role = await Role.findOne({ _id: user.roles[0] });
    if (role.name.toUpperCase() === definedRole.toUpperCase()) {
      next();
    }
  } catch (err) {
    switch (err.status) {
      case 403:
        return res
          .status(403)
          .send({ message: `Nécessite le rôle de ${definedRole} !` });
      case 401:
        return res.status(401).send({ message: "Non autorisé !" });
      default:
        return res.status(500).send({ message: `$Erreur ${res.statusCode} !` });
    }
  }
};

const isProvider = async (req, res, next) => {
  const definedRole = "provider";
  const userId = req.auth.userId;
  try {
    const user = await User.findById(userId);
    const role = await Role.findOne({ _id: user.roles[0] });
    if (role.name.toUpperCase() === definedRole.toUpperCase()) {
      next();
    }
  } catch (err) {
    switch (err.status) {
      case 403:
        return res
          .status(403)
          .send({ message: `Nécessite le rôle de ${definedRole} !` });
      case 401:
        return res.status(401).send({ message: "Non autorisé !" });
      default:
        return res.status(500).send({ message: `$Erreur ${res.statusCode} !` });
    }
  }
};

const isNewUser = async (req, res, next) => {
  const definedRole = "new_user";
  const userId = req.auth.userId;
  try {
    const user = await User.findById(userId);
    const role = await Role.findOne({ _id: user.roles[0] });
    if (role.name.toUpperCase() === definedRole.toUpperCase()) {
      next();
    }
  } catch (err) {
    switch (err.status) {
      case 403:
        return res
          .status(403)
          .send({ message: `Nécessite le rôle de ${definedRole} !` });
      case 401:
        return res.status(401).send({ message: "Non autorisé !" });
      default:
        return res.status(500).send({ message: `$Erreur ${res.statusCode} !` });
    }
  }
};

const authJwt = {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  isSuperAdmin,
  isAdmin,
  isClient,
  isProvider,
  isNewUser,
};
export default authJwt;
