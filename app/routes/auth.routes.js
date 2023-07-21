/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints for authentication
 */

import {refreshToken, signin, signup} from "../controllers/auth.controller.js";
import express from "express";
import verifySignUp from "../middlewares/verifySignUp.js";

const app = express()
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
 * /api/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *       200:
 *         description: Success, user registered successfully.
 *       400:
 *         description: Bad Request - Some required fields are missing or invalid.
 *       409:
 *         description: Conflict - Username or email already exists.
 *       500:
 *         description: Internal Server Error.
 */
authRouter.post(
    "/signup",
    [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted
    ],
    signup
);
/**
 * @swagger
 * /api/signin:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Auth]
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
 *               password: azertyuiop
 *     responses:
 *       200:
 *         description: Success, user authenticated successfully.
 *       400:
 *         description: Bad Request - Some required fields are missing or invalid.
 *       401:
 *         description: Unauthorized - Incorrect username or password.
 *       500:
 *         description: Internal Server Error.
 */
authRouter.post("/signin", signin);

/**
 * @swagger
 * /api/refreshToken:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Auth]
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
 *       200:
 *         description: Success, access token refreshed successfully.
 *       400:
 *         description: Bad Request - Some required fields are missing or invalid.
 *       401:
 *         description: Unauthorized - Invalid refresh token.
 *       500:
 *         description: Internal Server Error.
 */
authRouter.post('/refreshToken',refreshToken)

export default authRouter;
