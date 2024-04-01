import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { findUser, signup, updateUser } from "../services/usersServices.js";
import { subscriptionList } from "../constants/user-constants.js";

const { JWT_SECRET } = process.env;

export const register = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await signup({ ...req.body, password: hashPassword });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

export const login = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id: id } = user;
  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await updateUser({ _id: id }, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

export const getCurrent = ctrlWrapper(async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
});

export const logout = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  await updateUser({ _id }, { token: null });
  res.status(204).json();
});

export const updateUserSubscription = ctrlWrapper(async (req, res) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;
  if (!subscriptionList.includes(subscription)) {
    throw HttpError(400, "Invalid subscription value");
  }
  const result = await updateUser({ _id }, { subscription });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ email, subscription });
});
