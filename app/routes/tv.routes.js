import express from "express";
import authJwt from "../middlewares/authJwt.js";
import tvController from "../controllers/tv.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/tv/all:
 *   get:
 *     summary: Get list of TV shows
 *     tags: [TV-show]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page.
 *     responses:
 *       200:
 *         description: Success, returns a list of TV shows
 *       500:
 *         description: Error, cannot get TV shows
 */
router.get(
  "/all",
  [authJwt.verifyToken, authJwt.isAdmin],
  tvController.getAllTV
);

/**
 * @swagger
 * /api/tv/{id}:
 *   get:
 *     summary: Get a TV show by ID
 *     tags: [TV-show]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the TV show
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success, returns a TV show by ID
 *       404:
 *         description: Error, TV show not found
 *       500:
 *         description: Error, cannot get TV show
 */
router.get("/:id", tvController.getTVById);

/**
 * @swagger
 * /api/tv:
 *   post:
 *     summary: Create a new TV show
 *     tags: [TV-show]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TVRequest'
 *           examples:
 *             example-1:
 *               value:
 *                 name: "New TV Show"
 *                 original_name: "New TV Show (Original)"
 *                 overview: "This is a new TV show."
 *                 in_production: true
 *                 status: "Ongoing"
 *                 original_language: "English"
 *                 origin_country: ["US"]
 *                 created_by: ["John Doe"]
 *                 first_air_date: "2023-01-01"
 *                 last_air_date: "2023-12-31"
 *                 number_of_episodes: 10
 *                 number_of_seasons: 1
 *                 production_companies: ["ABC Studios"]
 *                 poster_path: "/path/to/poster.jpg"
 *                 genres:
 *                   - id: 1
 *                     name: "Drama"
 *                   - id: 2
 *                     name: "Action"
 *                 vote_average: 8.5
 *                 vote_count: 100
 *                 popularity: 80.5
 *     responses:
 *       200:
 *         description: Success, returns the new TV show
 *       400:
 *         description: Error, unable to create TV show
 */
router.post("/", tvController.createTV);

/**
 * @swagger
 * /api/tv/{id}:
 *   patch:
 *     summary: Update a TV show
 *     tags: [TV-show]  # Remove the hyphen before TV-show
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the TV show
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TVRequest'  # Indentation fix here
 *           examples:
 *             example-1:
 *               value:
 *                 name: "Updated TV Show"
 *                 original_name: "Updated TV Show (Original)"
 *                 overview: "This is an updated TV show."
 *                 in_production: false
 *                 status: "Ended"
 *                 original_language: "English"
 *                 origin_country: ["US"]
 *                 created_by: ["Jane Smith"]
 *                 first_air_date: "2023-02-15"
 *                 last_air_date: "2023-11-30"
 *                 number_of_episodes: 12
 *                 number_of_seasons: 2
 *                 production_companies: ["XYZ Studios"]
 *                 poster_path: "/path/to/updated_poster.jpg"
 *                 genres:
 *                   - id: 3
 *                     name: "Comedy"
 *                   - id: 4
 *                     name: "Adventure"
 *                 vote_average: 9.0
 *                 vote_count: 150
 *                 popularity: 90.2
 *     responses:
 *       200:
 *         description: Success, returns the updated TV show
 *       404:
 *         description: Error, TV show not found
 *       500:
 *         description: Error message
 */
router.patch("/:id", tvController.updateTV);

/**
 * @swagger
 * /api/tv/{id}:
 *   delete:
 *     summary: Delete a TV show
 *     tags: [TV-show]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the TV show
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success, TV show deleted
 *       404:
 *         description: Error, TV show not found
 *       500:
 *         description: Error message
 */
router.delete("/:id", tvController.deleteTV);

export default router;
