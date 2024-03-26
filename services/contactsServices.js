import Contact from "../models/Contact.js";

export const listContacts = () => Contact.find({}, "-createdAt -updatedAt");

export const getContactById = (contactId) => Contact.findById(contactId);

export const addContact = (body) => Contact.create(body);

export const refreshContact = (contactId, body) =>
  Contact.findByIdAndUpdate(contactId, body);

export const removeContact = (contactId) =>
  Contact.findByIdAndDelete(contactId);

export const refreshStatusContact = (contactId, body) =>
  Contact.findByIdAndUpdate(contactId, body);
