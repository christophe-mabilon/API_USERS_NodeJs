import db from "../models/index.js";

const ROLES = db.ROLES;
const User = db.user;
/**
 * Vérifie si le nom d'utilisateur ou l'adresse email existe déjà en base de données
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Cherche un utilisateur par son mom d'utilisateur
    const [existingUsername] = await Promise.all([User.findOne({username: req.body.username})]);

    // Si un utilisateur est trouvé, renvoie une réponse d'erreur
    if (existingUsername) {
      return res.status(400).send({ message: "Échec ! Le nom d'utilisateur est déjà utilisé !" });
    }

    // Cherche un utilisateur par adresse email
    const [existingEmail] = await Promise.all([User.findOne({email: req.body.email})]);

    // Si un utilisateur est trouvé, renvoie une réponse d'erreur
    if (existingEmail) {
      return res.status(400).send({ message: "Échec ! L'email est déjà utilisé !" });
    }

    // Si aucun utilisateur n'est trouvé, passe au middleware suivant
    next();
  } catch (err) {
    // En cas d'erreur, renvoie une réponse d'erreur 500
    res.status(500).send({ message: err });
  }
};

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
    for (const element of req.body.roles) {
      if (!ROLES.includes(element)) {
        res.status(400).send({
          message: `Échec ! Le rôle ${element} n'existe pas!`
        });
        return;
      }
    }
  }

  next();
};


const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

export default verifySignUp;
