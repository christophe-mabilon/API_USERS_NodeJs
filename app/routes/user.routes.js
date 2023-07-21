/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API to manage your users.
 */

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
 * @swagger
 * /api/super-admin/users:
 *   get:
 *     summary: Get all users infos for admin access only.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success, return all admin users infos.
 *       401:
 *         description: Not authorized, token missing or invalid.
 *       500:
 *         description: Error, cannot get users infos.
 */
userRouter.get("/super-admin/users", [authJwt.verifyToken, authJwt.isSuperAdmin], getAllUsersInfosSuperAdminAccess);

/**
 * @swagger
 * /api/super-admin/users:
 *   get:
 *     summary: Get all users infos for admin access only.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success, return all admin users infos.
 *       401:
 *         description: Not authorized, token missing or invalid.
 *       500:
 *         description: Error, cannot get users infos.
 */
userRouter.get("/admin/users", [authJwt.verifyToken, authJwt.isAdmin], getAllUsersInfos);


/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: get user infos.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: user id to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success, return user infos.
 *       401:
 *         description: Not authorized, token missing or invalid.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error, cannot get user infos.
 */
userRouter.get("/user/:id", [authJwt.verifyToken], getUserInfos);



/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Edit user infos.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: user id to edit
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success, user infos updated.
 *       401:
 *         description: Not authorized, token missing or invalid.
 *       403:
 *         description: Not authorized, user is not admin or super admin.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error, cannot update user infos.
 */
userRouter.put("/user/:id", [authJwt.verifyToken], editUserInfos);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: user id to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success, user deleted.
 *       401:
 *         description: Not authorized, token missing or invalid.
 *       403:
 *         description: Not authorized, user is not admin or super admin.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error, cannot delete user.
 */
userRouter.delete("/user/:id", [authJwt.verifyToken], deleteUser);

export default userRouter;
