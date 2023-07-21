/**
 * @swagger
 * tags:
 *   name: API USERS
 *   description: API Users endpoints
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
 *       401:
 *         description: Not authorized, token missing or invalid.
 *       500:
 *         description: Error, cannot get users' information.
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
 *       401:
 *         description: Not authorized, token missing or invalid.
 *       500:
 *         description: Error, cannot get users' information.
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success, returns user information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized, token missing or invalid.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error, cannot get user information.
 */
userRouter.get("/user/:id", [authJwt.verifyToken], getUserInfos);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Edit user information.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID to edit.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserEdit'
 *     responses:
 *       200:
 *         description: Success, user information updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully!
 *       401:
 *         description: Not authorized, token missing or invalid.
 *       403:
 *         description: Not authorized, user is not admin or super admin.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error, cannot update user information.
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
