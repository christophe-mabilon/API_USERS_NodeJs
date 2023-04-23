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

authRouter.post(
    "/signup",
    [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted
    ],
    signup
);

authRouter.post("/signin", signin);

authRouter.post('/refreshToken',refreshToken)

export default authRouter;