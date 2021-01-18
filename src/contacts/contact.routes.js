const Router = require('express').Router;
const contactsRouter = Router();
const contactsController = require('../contacts/contact.controller');

contactsRouter.get('/api/contacts', contactsController.getContacts);
contactsRouter.get('/api/contacts/:contactId', contactsController.getContactById);
contactsRouter.patch('/api/contacts/:contactId', contactsController.updateContact);
contactsRouter.post('/api/contacts', contactsController.createContact);
contactsRouter.delete('/api/contacts/:contactId', contactsController.deleteContact);

module.exports = contactsRouter;