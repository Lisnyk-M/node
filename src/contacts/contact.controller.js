const { ObjectId } = require('mongodb');
const contactModel = require('../contacts/contact.model');
const contactValidator = require('../validators/contact.validator');
const idSchema = require('../schemas/id.schema');
const contactSchema = require('../schemas/contact.schema');
const subscriptionSchema = require('../schemas/subscription.schema');

const PAGE_DEFAULT = 1;
const LIMIT_DEFAULT = 20;

class ContactController {
    async getContacts(req, res, next) {
        try {
            const page = req.query.page ? Number(req.query.page) : PAGE_DEFAULT;
            const limit = req.query.limit ? Number(req.query.limit) : LIMIT_DEFAULT;
            const sub = req.query.sub ? { subscription: req.query.sub } : {};

            const validate = await contactValidator(res, { subscription: req.query.sub }, subscriptionSchema);
            if (validate) {
                return res.status(404).send({ message: 'query is not defined.' });
            }

            const contacts = await contactModel.find(sub, function (err, result) { })
                .skip(page).limit(limit);

            return res.status(200).send(contacts);
        }
        catch (err) {
            next(err);
        }
    }

    async getContactById(req, res, next) {
        const validate = await contactValidator(res, { _id: req.params.contactId }, idSchema);
        if (validate) {
            return res.status(404).send({ message: 'contact not found.' });
        }
        try {
            const contacts = await contactModel.find(
                { _id: ObjectId(req.params.contactId) },
                // function (err, result) { }
            );
            return contacts.length < 1
                ? res.status(404).send({ message: 'contact not found.' })
                : res.status(200).send(contacts);
        }
        catch (err) {
            next(err);
        }
        next();
    }

    async createContact(req, res, next) {
        const validate = await contactValidator(res, req.body, contactSchema);
        if (validate) {
            return res.status(400).send({ error: validate });
        }
        try {
            const newContact = await contactModel.create(req.body);
            return res.status(200).json(newContact);
        }
        catch (err) {
            next(err);
        }
        next();
    }

    async updateContact(req, res, next) {
        const validate = await contactValidator(res, { _id: req.params.contactId }, idSchema);

        if (validate) {
            return res.status(404).send({ message: 'contact not found.' });
        }
        try {
            const newContact = await contactModel.findByIdAndUpdate(
                req.params.contactId,
                { $set: req.body },
                { new: true, runValidators: true }
            );
            return res.status(200).send({
                email: newContact.email,
                subscription: newContact.subscription
            });
        }
        catch (err) {
            next(err);
        }
        next();
    }

    async deleteContact(req, res, next) {
        const validate = await contactValidator(res, { _id: req.params.contactId }, idSchema);
        if (validate) {
            res.status(404).send({ message: 'contact not found.' });
        }

        try {
            const newContact = await contactModel.findByIdAndDelete(
                req.params.contactId,
                { runValidators: true }
            );
            return res.status(200).send({
                message: 'contact sucessfully deleted'
            });
        }
        catch (err) {
            next(err);
        }
        next();
    }
}

module.exports = new ContactController();