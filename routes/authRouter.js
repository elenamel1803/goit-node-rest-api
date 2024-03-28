import express from "express";
import validateBody from "../helpers/validateBody.js";
import { register, login } from "../controllers/authControllers.js";
import { userSignupSchema } from "../schemas/usersSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(userSignupSchema), register);

authRouter.post("/login", validateBody(userSignupSchema), login);

authRouter.post("/logout");

authRouter.get("/current");

authRouter.patch("");

export default authRouter;
