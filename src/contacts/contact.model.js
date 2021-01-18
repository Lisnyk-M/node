const mongoose = require('mongoose');
const { Schema, Types: { ObjectId } } = mongoose;

const subscriptionValidate = (value) => {
    const subs = ["free", "pro", "premium"];
    return subs.includes(value);
}

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
        validate: {
            validator: (value) => subscriptionValidate(value),
            // validator: (value) => ["free", "pro", "premium"].includes(value),
            message: 'subscription incorrect',
        },
        default: 'free'
    },
    password: {
        type: String,
        // required: true
    },
    token: {
        type: String,
        required: false
    }
});

const contactModel = mongoose.model('Contact', contactSchema);

module.exports = contactModel;