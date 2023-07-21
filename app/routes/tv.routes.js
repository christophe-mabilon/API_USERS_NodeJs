import express from "express";
import authJwt from "../middlewares/authJwt.js";
import tvController from "../controllers/tv.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/tv/all:
 *   get:
 *     summary: Get list of tv show
 *     tags: [TV series]
 *     responses:
 *       200:
 *         description: Success, returns a list of tv
 *       500:
 *         description: Error, cannot get tv
 */
router.get(
  "/all",
  [authJwt.verifyToken, authJwt.isAdmin],
  tvController.getAllTV
);

/**
 * @swagger
 * /api/tv/{id}/:
 *   get:
 *     summary: Get a tv show by id
 *     tags: [TV series]
 *     responses:
 *       200:
 *         description: Success, returns a tv by id
 *       404: Error, Tv not found
 *       500:
 *         description: Error, cannot get tv
 */
router.get("/:id", tvController.getTVById);

/**
 * @swagger
 * /api/tv/:
 *   post:
 *     summary: Create a new tv show
 *     tags: [TV series]
 *     responses:
 *       200:
 *         description: Success, returns the new tv
 *       400:
 *         description: Error, cannot get tv
 */
router.post("/", tvController.createTV);

/**
 * @swagger
 * /api/tv/{id}:
 *   patch:
 *     summary: Update a tv show
 *     tags: [TV series]
 *     responses:
 *       200:
 *         description: Success, returns the new tv
 *       404: Error, Tv not found
 *       500:
 *         description: Error message
 */
router.patch("/:id", tvController.updateTV);

/**
 * @swagger
 * /api/tv/{id}:
 *   delete:
 *     summary: Delete a tv show
 *     tags: [TV series]
 *     responses:
 *       200:
 *         description: Success, TV deleted
 *       404: Error, Tv not found
 *       500:
 *         description: Error message
 */
router.delete("/:id", tvController.deleteTV);

export default router;
