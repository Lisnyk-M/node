const joi = require('joi');
const ContactsService = require('../services/contacts.service');
const contactSchema = require('../schemas/contact.schema');
const contactValidator = require('../validators/validator.contact');

class ContactsController {

    getContacts(req, res) {
        return res.status(200).send({ message: 'getContacts is worked', data: req.contacts })
    }

    getContactById(req, res) {
        const foundContact = req.contacts.find(el => el.id.toString() === req.params.contactId);

        if (foundContact) {
            return res.status(200).send({
                data: foundContact
            })
        }
        else {
            return res
                .status(404)
                .send({ message: 'contact not found.' });
        }
    }

    async createContact(req, res) {
        const validate = await contactValidator(res, req.body, contactSchema);
        if (!validate) {
            let maxId = req.contacts.reduce((max, cur) => {
                return Math.max(max, cur.id);
            }, 1);

            const existedContact = req.contacts.find(contact => contact.name == req.body.name);
            if (existedContact) {
                return res
                    .status(409)
                    .send({ message: 'User already exists.' })
            }

            req.contacts.push({ id: maxId + 1, ...req.body });
            let result = await ContactsService.createContact(req.contacts)

            if (result) return res.status(200).send(result)
            else
                return res
                    .status(500)
                    .send({ message: 'Unable create contact.' })
        }
        else
            return res
                .status(400)
                .send({ message: validate })
    }

    async updateContact(req, res) {
        if (req.body) {

            const existedContact = req.contacts.find(contact => contact.id == req.params.contactId);
            if (!existedContact) {
                return res
                    .status(404)
                    .send({ message: 'Contact not found.' })
            }

            const updatedContact = { ...existedContact, ...req.body }

            const updatedContacts = req.contacts.map(contact => {
                return contact.id != req.params.contactId ? contact : updatedContact;
            })

            let result = await ContactsService.updateContact(updatedContacts);

            if (result) return res.status(200).send(result)
            else
                return res
                    .status(500)
                    .send({ message: 'Unable create contact.' })
        } else
            return res
                .status(400)
                .send({ message: 'Bad request.' })
    }


    async deleteContact(req, res) {
        if (req.params.contactId) {

            const existedContact = req.contacts.find(contact => contact.id == req.params.contactId);
            if (!existedContact) {
                return res
                    .status(404)
                    .send({ message: 'Contact not found.' })
            }
            const filteredContacts = req.contacts.filter(contact => contact.id != req.params.contactId);
            let result = await ContactsService.deleteContact(filteredContacts);

            if (result) return res.status(200).send(result)
            else
                return res
                    .status(500)
                    .send({ message: 'Unable create contact.' })
        } else
            return res
                .status(400)
                .send({ message: 'Bad request.' })
    }
}

module.exports = new ContactsController()