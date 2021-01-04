const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const dbURI = 'mongodb+srv://dog:cot@cluster0.kf6wm.mongodb.net/db-contacts?retryWrites=true&w=majority';

const contactSchema = Schema({ 
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        validate: (value) => value.includes('@'),
        unique: true,
    },
    phone: String,
    subscription: {
        type: String,
        default: 'free'
    },
    password: {
        type: String,
        default: 'password'
    },
    token: String
});

const Contacts = mongoose.model('contacts', contactSchema);

class ContactService {
    dbConnect() {
        mongoose.connect(dbURI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            },
            function (err) {
                if (err) throw err;
                console.log('Successfully connected');
            });
    };

    async getContacts(findsFilter) {
        return await Contacts.find(findsFilter, function (err, result) {
            if (err) process.exit(1);
        })
    }

    async createContact(contact, next) {
        let record = new Contacts(contact);

        await record.save(function (error) {
            if (error) {
                return next(error);
            }
            return next();
        })
    }

    async deleteContact(contact, next) {
        Contacts.deleteOne(contact, function (error) {
            if (error) {
                return next(error);
            }
            return next();
        });
    }

    //  (findOne + save) for validate entered parameters
    async updateContact(filter, contact, next) {
        Contacts.findOne({ _id: ObjectId(filter) })
            .then(user => {
                const newUser = Object.assign(user, contact);
                newUser.save(function (error) {
                    if (error) {
                        return next(error);
                    }
                    return next();
                });
            })
    }
}

module.exports = new ContactService();