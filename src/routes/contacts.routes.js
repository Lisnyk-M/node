const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts.controller');

router.route('/')
    .get(contactsController.getContacts)
    .post(contactsController.createContact);

router.route('/:contactId')
    .get(contactsController.getContactById)
    .delete(contactsController.deleteContact)
    .put(contactsController.updateContact);  

module.exports = router;