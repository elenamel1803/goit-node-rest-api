import Contact from "../models/Contact.js";

export const countContacts = (filter) => Contact.countDocuments(filter);

export const listContacts = (filter = {}, settings = {}) =>
  Contact.find(filter, "-createdAt -updatedAt", settings).populate(
    "owner",
    "email"
  );

export const getContactByFilter = (filter) => Contact.findOne(filter);

export const addContact = (body) => Contact.create(body);

export const refreshContact = (filter, body) =>
  Contact.findOneAndUpdate(filter, body);

export const removeContact = (filter) => Contact.findOneAndDelete(filter);

export const refreshStatusContact = (filter, body) =>
  Contact.findOneAndUpdate(filter, body);
