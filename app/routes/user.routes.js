
import {
  deleteUser,
  editUserInfos,
  getAllUsersInfos,
  getAllUsersInfosSuperAdminAccess,
  getUserInfos,
} from "../controllers/user.controller.js";
import express from "express";
import authJwt from "../middlewares/authJwt.js";

const userRouter = express.Router();

/**
 * @swagger
 * /api/super-admin/users:
 *   get:
 *     summary: Get all users' information for super-admin access only.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success, returns all admin users' information.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get(
  "/super-admin/users",
  [authJwt.verifyToken, authJwt.isSuperAdmin],
  getAllUsersInfosSuperAdminAccess
);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users' information for admin access only.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Success, returns all admin users' information.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get(
  "/admin/users",
  [authJwt.verifyToken, authJwt.isAdmin],
  getAllUsersInfos
);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user information by ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to fetch.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success, returns user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: User ID.
 *                   example: 5f9d4f8f5f9d4f8f5f9d4f8f
 *                 username:
 *                   type: string
 *                   description: User username.
 *                   example: bertrand_test
 *                 email:
 *                   type: string
 *                   description: User email.
 *                   example: bertrand@test.fr
 *                 roles:
 *                   type: array
 *                   description: User roles.
 *                   example: ["user", "admin"]
 */
userRouter.get("/user/:id", [authJwt.verifyToken], getUserInfos);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Edit user information.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 example: Leanne Graham
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success, user information updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User ID.
 *                       example: 5f9d4f8f5f9d4f8f5f9d4f8f
 *                     username:
 *                       type: string
 *                       description: User username.
 *                       example: bertrand_test
 *                     email:
 *                       type: string
 *                       description: User email.
 *                       example: bertrand@test.fr
 *                     roles:
 *                       type: array
 *                       description: User roles.
 *                       example: ["user", "admin"]
 */
userRouter.put("/user/:id", [authJwt.verifyToken], editUserInfos);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete user by ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success, user deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully!
 */
userRouter.delete("/user/:id", [authJwt.verifyToken], deleteUser);

export default userRouter;
