import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  register,
  login,
  getCurrent,
  logout,
  updateUserSubscription,
  updateAvatar,
  verify,
  resendVerify,
} from "../controllers/usersControllers.js";
import {
  updateUserSubscriptionSchema,
  userEmailSchema,
  usersSchema,
} from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(usersSchema), register);

usersRouter.get("/verify/:verificationToken", verify);

usersRouter.post("/verify", validateBody(userEmailSchema), resendVerify);

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
