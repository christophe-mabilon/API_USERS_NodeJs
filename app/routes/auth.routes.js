/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints for user authentication
 */


import {
  refreshToken,
  signin,
  signup,
} from "../controllers/auth.controller.js";
import express from "express";
import verifySignUp from "../middlewares/verifySignUp.js";

const app = express();
const authRouter = express.Router();
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: bertrand_test
 *               email: bertrand@example.com
 *               password: mypassword123
 *     responses:
 *       '200':
 *         description: Success, user registered successfully.
 *       '400':
 *         description: Bad Request - Some required fields are missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the cause of the bad request.
 *       '409':
 *         description: Conflict - Username or email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the conflict.
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the internal server error.
 *     examples:
 *       example-1:
 *         summary: Example request for user registration.
 *         value:
 *           username: bertrand_test
 *           email: bertrand@example.com
 *           password: azertyuiop
 */
authRouter.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  signup
);
/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: bertrand_test
 *               password: mypassword123
 *     responses:
 *       '200':
 *         description: Success, user authenticated successfully.
 *       '400':
 *         description: Bad Request - Some required fields are missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the cause of the bad request.
 *       '401':
 *         description: Unauthorized - Incorrect username or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating unauthorized access.
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the internal server error.
 */
authRouter.post("/signin", signin);

/**
 * @swagger
 * /api/auth/refreshToken:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Authentication]
 *     description: Use this endpoint to refresh the access token by providing a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: your_refresh_token_here
 *     responses:
 *       '200':
 *         description: Success. The access token has been refreshed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token.
 *                 refreshToken:
 *                   type: string
 *                   description: The new refresh token.
 *       '400':
 *         description: Bad Request. Some required fields are missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the cause of the bad request.
 *       '401':
 *         description: Unauthorized. Invalid refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating unauthorized access.
 *       '500':
 *         description: Internal Server Error. An internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the internal server error.
 *     examples:
 *       example-1:
 *         summary: Example request to refresh the access token.
 *         value:
 *           refreshToken: your_refresh_token_here
 */
authRouter.post("/refreshToken", refreshToken);

export default authRouter;
