import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { findUser, signup, signin } from "../services/usersServices.js";

const { JWT_SECRET } = process.env;

export const register = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email already in ");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await signup({ ...req.body, password: hashPassword });
  res.status(201).json({
    email: newUser.email,
  });
});

export const login = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }
  const { _id: id } = user;
  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  res.json({
    token,
  });
});
