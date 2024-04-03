import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  register,
  login,
  getCurrent,
  logout,
  updateUserSubscription,
  updateAvatar,
} from "../controllers/usersControllers.js";
import {
  updateUserSubscriptionSchema,
  usersSchema,
} from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

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

usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

export default usersRouter;
