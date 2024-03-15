import {
  listContacts,
  getContactById,
  addContact,
  refreshContact,
  removeContact,
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

export const getAllContacts = ctrlWrapper(async (_, res) => {
  const result = await listContacts();
  res.json(result);
});

export const getOneContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await getContactById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});

export const createContact = ctrlWrapper(async (req, res) => {
  const result = await addContact(req.body);
  res.status(201).json(result);
});

export const updateContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await refreshContact(id, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }
  res.json(result);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await removeContact(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});
