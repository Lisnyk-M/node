const ContactsService_v2 = require('../services/contact.service_v2');
const idSchema = require('../schemas/id.schema');
const contactValidator = require('../validators/validator.contact');
const { ObjectId} = require('mongodb');

ContactsService_v2.dbConnect();

class ContactsController {
    getContacts(req, res) {
        ContactsService_v2.getContacts({})
            .then(data => {
                return res.status(200).send({ message: 'getContacts is worked', data: data });
            });
    }

    async getContactById(req, res) {
        const validate = await contactValidator(res, { _id: req.params.contactId }, idSchema);
        if (validate) {
            res.status(404).send({ message: 'contact not found.' });
            console.log(validate);
        }
        else {
            ContactsService_v2.getContacts({ _id: ObjectId(req.params.contactId) })
                .then(data => {
                    return data.length > 0 ? res.status(200).send({ data: data }) :
                        res.status(404).send({ message: 'contact not found.' });
                })
        }
    }

    async createContact(req, res) {
        await ContactsService_v2.createContact(
            req.body,
            er => {
                let errorOut = null;
                if (er) {
                    errorOut = er.message;

                    if (er.message && ~er.message.indexOf('E11000 duplicate key')) {
                        errorOut = 'error: name or email already exists';
                    }
                }
                return er
                    ? res.status(500).send({ message: errorOut })
                    : res.status(200).send({ message: 'Contact successfully created.' });
            }
        );
    }

    async updateContact(req, res) {
        const validate = await contactValidator(res, { _id: req.params.contactId }, idSchema);

        if (validate) {
            res.status(404).send({ message: 'contact not found.' });
            console.log(validate);
        } 
        else {
            await ContactsService_v2.updateContact(
                req.params.contactId,
                req.body,
                er => {
                    return er
                        ? res.status(500).send({ message: er.message })
                        : res.status(200).send({ message: 'Contact successfully updated.' });
                }
            );
        }
    }

    async deleteContact(req, res) {
        const validate = await contactValidator(res, { _id: req.params.contactId }, idSchema);
        if (validate) {
            res.status(404).send({ message: 'contact not found.' });
            console.log(validate);
        } 
        else {
            await ContactsService_v2.deleteContact(
                { _id: ObjectId(req.params.contactId) },
                er => {
                    return er
                        ? res.status(500).send({ message: er.message })
                        : res.status(200).send({ message: 'Contact successfully deleted.' });
                }
            );
        }
    }
}

module.exports = new ContactsController();