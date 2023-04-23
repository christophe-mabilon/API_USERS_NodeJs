import db from "../models/index.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import authJwt from "../middlewares/authJwt.js";
import jwt from "jsonwebtoken";
dotenv.config();

const User = db.user;
const Role = db.role;

/**
 * fonction qui enregistre un nouvel utilisateur dans la base de données.
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const signup = async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        await user.save();

        if (req.body.roles) {
            const roles = await Role.find({
                name: { $in: req.body.roles }
            });

            user.roles = roles.map((role) => role._id);
            await user.save();
        } else {
            const role = await Role.findOne({ name: "new_user" });
            user.roles = [role._id];
            await user.save();
        }

        res.send({ message: "L'utilisateur a été enregistré avec succès !" });
    } catch (err) {
        res.status(500).send({ message: err });
    }
};

/**
 * fonction qui permet à un utilisateur de se connecter à la plateforme.
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const signin = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        }).populate('roles', '-__v');

        if (!user) {
            return res.status(404).send({ message: 'Utilisateur introuvable.'});
        }

        const passwordIsValid = await bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: 'Mot de passe incorrect !'
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 3600 // 1 hours
        });

        const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);

        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
        });
    } catch (err) {
        res.status(500).send({ message: err });
    }
};

/**
 * fonction qui permet de rafraichir le token d'un utilisateur.
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const refreshToken = (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(401)
        }

        // TODO: Check en base que l'user est toujours existant/autorisé à utiliser la plateforme
        delete user.iat;
        delete user.exp;
        const refreshedToken = authJwt.generateAccessToken(user);
        res.send({
            accessToken: refreshedToken,
        });
    })
}
