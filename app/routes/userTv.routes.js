import {
  getAllTvByUser,
  addTVToUser,
  deleteTvTuser,
} from "../controllers/userTv.controller.js";
import express from "express";

const userTvRouter = express.Router();

/**
 * @swagger
 * /api/usersTv/{userId}/all-tv:
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
userTvRouter.get("/:userId/all-tv", getAllTvByUser);

/**
 * @swagger
 * /api/usersTv/{userId}/add-tv/{tvId}:
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
userTvRouter.post("/:userId/add-tv/:tvId", addTVToUser);

/**
 * @swagger
 * /api/usersTv/{userId}/delete-tv/{tvId}:
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
userTvRouter.delete("/:userId/delete-tv/:tvId", deleteTvTuser);

export default userTvRouter;
