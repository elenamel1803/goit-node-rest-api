import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  register,
  login,
  getCurrent,
  logout,
  updateUserSubscription,
} from "../controllers/usersControllers.js";
import {
  updateUserSubscriptionSchema,
  usersSchema,
} from "../schemas/usersSchemas.js";
import authenticate from "../helpers/authenticate.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(usersSchema), register);

usersRouter.post("/login", validateBody(usersSchema), login);

usersRouter.post("/logout", authenticate, logout);

usersRouter.get("/current", authenticate, getCurrent);

usersRouter.patch(
  "/",
  validateBody(updateUserSubscriptionSchema),
  authenticate,
  updateUserSubscription
);

export default usersRouter;
