import {
  editRole,
  removeRole,
  deleteUser,
  editUserInfos,
  getAllUsersInfos,
  getAllUsersInfosSuperAdminAccess,
  getUserInfos,
  getUserById,
} from "../controllers/user.controller.js";
import express from "express";
import authJwt from "../middlewares/authJwt.js";

const userRouter = express.Router();

/**
 * @swagger
 * /api/super-admin/users:
 *   get:
 *     summary: Get all users' information for super-admin access only with pagination.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number.
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: The number of results per page.
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
 *     summary: Get all users' information for admin access only with pagination.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number.
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: The number of results per page.
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
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to patch.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username.
 *                 example: bertrand_test
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: bertrand@test.fr
 *               roles:
 *                 type: array
 *                 description: User roles.
 *                 items:
 *                   type: string
 *                   format: string
 *                   example: super-admin
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
 *                       example: ["super-admin", "admin"]
 *       404:
 *         description: Error, User not found
 *       500:
 *         description: Error message
 */
userRouter.put(
  "/user/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  editUserInfos
);

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

/**
 * @swagger
 * /api/user/{userId}/add/role:
 *   post:
 *     summary: Add user role
 *     tags: [Users-Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID for adding the role.
 *         schema:
 *           type: string
 *       - name: role
 *         in: body
 *         required: true
 *         description: Role object to be added to the user.
 *         schema:
 *           type: object
 *           properties:
 *             role:
 *               type: string
 *               example: "admin"
 *               description: The role to be added to the user.
 *     responses:
 *       200:
 *         description: Success, user updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully!
 */
userRouter.post(
  "/user/:userId/add/role",
  [authJwt.verifyToken, authJwt.isSuperAdmin || authJwt.isAdmin],
  editRole
);

/**
 * @swagger
 * /api/user/remove/role/{:id}:
 *   delete:
 *     summary: Remove user role
 *     tags: [Users-Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: add User role.
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
 *                   example: User updated successfully!
 */
userRouter.delete(
  "user/remove/role/:id",
  [authJwt.verifyToken, authJwt.isSuperAdmin, authJwt.isAdmin],
  removeRole
);

export default userRouter;
