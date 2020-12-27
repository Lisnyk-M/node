const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts.controller');
const ContactsService = require('../services/contacts.service');

router.use(async (req, res, next) => {
    let data = await ContactsService.getContacts()

    if (data) {
        req.contacts = data
        next()

    } else
        return res
            .status(500)
            .send({ message: 'Error while getting contacts' })
})

router.route('/')
    .get(contactsController.getContacts)
    .post(contactsController.createContact)


router.route('/:contactId')
    .get(contactsController.getContactById)
    .delete(contactsController.deleteContact)
    .put(contactsController.updateContact)   

module.exports = router;