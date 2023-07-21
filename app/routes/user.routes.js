import {
    deleteUser,
    editUserInfos,
    getAllUsersInfos,
    getAllUsersInfosSuperAdminAccess,
    getUserInfos,
} from "../controllers/user.controller.js";
import express from "express";
import authJwt from "../middlewares/authJwt.js";

const app = express();
const userRouter = express.Router();

app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});
/**
 * recupere les informations des utilisateurs enregistrés disponible pour l'admin et le super admin
 */
userRouter.get("/super-admin/users", [authJwt.verifyToken, authJwt.isSuperAdmin], getAllUsersInfosSuperAdminAccess);
userRouter.get("/admin/users", [authJwt.verifyToken, authJwt.isAdmin], getAllUsersInfos);


/**
 *
 * recupere les information d'un utilisateur
 */
userRouter.get("/user/:id", [authJwt.verifyToken], getUserInfos);

/**
 *
 * modifie les informations d'un utilisateur
 */
userRouter.put("/user/:id", [authJwt.verifyToken], editUserInfos);

/**
 *
 * supprime un utilisateur
 */
userRouter.delete("/user/:id", [authJwt.verifyToken], deleteUser);

export default userRouter;
