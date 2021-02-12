const mongoose = require('mongoose');
const { Schema, Types: { ObjectId } } = mongoose;

const subscriptionValidate = (value) => {
    const subs = ["free", "pro", "premium"];
    return subs.includes(value);
}

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatarURL: String,
    subscription: {
        type: String,
        enum: ["free", "pro", "premium"],
        validate: {
            validator: (value) => subscriptionValidate(value),
            message: 'subscription incorrect',
        },
        default: "free"
    },
    token: { type: String },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;