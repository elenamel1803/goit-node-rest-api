import {
  listContacts,
  getContactByFilter,
  addContact,
  refreshContact,
  removeContact,
  refreshStatusContact,
  countContacts,
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

export const getAllContacts = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const filter = { owner };
  if (favorite) {
    filter.favorite = favorite === "true";
  }
  const result = await listContacts(filter, { skip, limit });
  const total = await countContacts(filter);
  res.json({ result, total });
});

export const getOneContact = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await getContactByFilter({ owner, _id: id });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});

export const createContact = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const result = await addContact({ ...req.body, owner });
  res.status(201).json(result);
});

export const updateContact = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await refreshContact({ owner, _id: id }, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }
  res.json(result);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await removeContact({ owner, _id: id });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});

export const updateStatusContact = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await refreshStatusContact({ owner, _id: id }, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});
