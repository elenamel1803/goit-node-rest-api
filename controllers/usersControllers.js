import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { nanoid } from "nanoid";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { findUser, signup, updateUser } from "../services/usersServices.js";
import { subscriptionList } from "../constants/user-constants.js";
import { sendEmail } from "../helpers/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;

const avatarsPath = path.resolve("public", "avatars");

export const register = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();
  const newUser = await signup({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

export const verify = ctrlWrapper(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await updateUser(
    { _id: user._id },
    { verify: true, verificationToken: null }
  );
  res.json({
    message: "Verification successful",
  });
});

export const resendVerify = ctrlWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.json({
    message: "Verification email sent",
  });
});

export const login = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
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

export const updateAvatar = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }
  const { path: tmpUpload, originalname } = req.file;
  const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniquePrefix}_${originalname}`;
  const resultUpload = path.join(avatarsPath, filename);
  const image = await Jimp.read(tmpUpload);
  await image.cover(250, 250).quality(90).writeAsync(resultUpload);
  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await updateUser({ _id }, { avatarURL });
  res.json({
    avatarURL,
  });
});
