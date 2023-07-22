import {
  getAllTvByUser,
  addTVToUser,
  editTvUser,
  deleteTvTuser,
  editRole,
  removeRole,
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
 *                       example: ["super-admin", "admin"]
 *
 *       404:
 *         description: Error, User not found
 *       500:
 *         description: Error message
 */
userRouter.put(
  "/user/:id",
  [authJwt.verifyToken, authJwt.isSuperAdmin, authJwt.isAdmin],
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
 * user/add/role/{:id}:
 *   post:
 *     summary: Add user role
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
userRouter.post(
  "user/add/role/:id",
  [authJwt.verifyToken, authJwt.isSuperAdmin, authJwt.isAdmin],
  editRole
);

/**
 * @swagger
 * user/remove/role/{:id}:
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

/**
 * @swagger
 * /users/{userId}/all-tv:
 *   get:
 *     summary: Get all TV shows for a specific user
 *     tags: [User-TV]
 *     description: Retrieve all TV shows associated with a user by user ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: A list of TV shows for the user.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
userRouter.get("/users/:userId/all-tv", getAllTvByUser);

/**
 * @swagger
 * /users/{userId}/add-tv/{tvId}:
 *   post:
 *     summary: Add a TV show to a specific user
 *     tags: [User-TV]
 *     description: Add a TV show to a user's collection by user ID and TV show ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *       - in: path
 *         name: tvId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the TV show to be added.
 *     responses:
 *       200:
 *         description: TV show added to user successfully.
 *       400:
 *         description: Invalid user or TV show ID provided.
 *       404:
 *         description: User or TV show not found.
 *       500:
 *         description: Internal server error.
 */
userRouter.post("/users/:userId/add-tv/:tvId", addTVToUser);

/**
 * @swagger
 * /users/{userId}/edit-tv/{tvId}:
 *   patch:
 *     summary: Edit a TV show of a specific user
 *     tags: [User-TV]
 *     description: Edit a TV show of a user's collection by user ID and TV show ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *       - in: path
 *         name: tvId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the TV show to be edited.
 *     responses:
 *       200:
 *         description: TV show edited successfully.
 *       400:
 *         description: Invalid user or TV show ID provided.
 *       404:
 *         description: User or TV show not found.
 *       500:
 *         description: Internal server error.
 */
userRouter.patch("/users/:userId/edit-tv/:tvId", editTvUser);

/**
 * @swagger
 * /users/{userId}/delete-tv/{tvId}:
 *   delete:
 *     summary: Delete a TV show from a specific user
 *     tags: [User-TV]
 *     description: Delete a TV show from a user's collection by user ID and TV show ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *       - in: path
 *         name: tvId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the TV show to be deleted.
 *     responses:
 *       200:
 *         description: TV show deleted successfully.
 *       400:
 *         description: Invalid user or TV show ID provided.
 *       404:
 *         description: User or TV show not found.
 *       500:
 *         description: Internal server error.
 */
userRouter.delete("/users/:userId/delete-tv/:tvId", deleteTvTuser);

export default userRouter;
