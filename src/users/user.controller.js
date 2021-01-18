const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('./user.model');
const contactValidator = require('../validators/contact.validator');
const userRegisterSchema = require('../schemas/user.register.schema');
const idSchema = require('../schemas/id.schema');

const SALT_FACTOR = 8;

class UserController {
    async getUserById(req, res, next) {
        try {
            const validate = await contactValidator(res, { _id: req.params.userId }, idSchema);

            if (validate) {
                return res.status(404).send({ message: 'user not found.' });
            }
            const user = await userModel.findOne({ _id: ObjectId(req.params.userId) }, function (err, result) { });
            return res.status(200).send(user);
        }
        catch (err) {
            next(err);
        }
        next();
    };

    async registerUser(req, res, next) {
        try {
            const validate = await contactValidator(res, req.body, userRegisterSchema);
            if (validate) {
                return res.status(400).send({ error: validate });
            }
            const hashPassword = await bcrypt.hash(req.body.password, SALT_FACTOR);
            req.body.password = hashPassword;

            const uniqueUser = await userModel.findOne({ email: req.body.email }).exec();
            if (uniqueUser) {
                return res.status(409).send({ message: "Email in use" });
            }
            const responseBody = {
                user: {
                    email: req.body.email,
                    subscription: req.body.subscription
                }
            }
            const newContact = await userModel.create(req.body);

            return newContact
                ? res.status(201).send(responseBody)
                : res.status(400).send({ message: "error create user" });

        } catch (err) {
            next(err);
        }
        next();
    }

    async getRegisteredUsers(req, res, next) {
        try {
            const newContact = await userModel.find({});
            return newContact
                ? res.status(200).send(newContact)
                : res.status(400).send({ message: "error users not found" });
        } catch (err) {
            next(err);
        }
        next();
    }

    async userLogin(req, res, next) {
        try {
            const token = jwt.sign({ id: req.existingUser._id }, process.env.JWT_SECRET, {
                expiresIn: 2 * 24 * 60 * 60     //two days
            });

            await userModel.findByIdAndUpdate(req.existingUser._id, { $set: { token } });

            return res.status(200).json({
                token,
                user: {
                    email: req.existingUser.email,
                    subscription: req.existingUser.subscription
                }
            })
        }
        catch (err) {
            next(err);
        }
        next();
    }

    async userLogout(req, res, next) {
        try {
            const validateToken =  jwt.verify(req.token, process.env.JWT_SECRET, function (err, decoded) {
                
                if (err) {
                    return res.status(401).send({ message: "Unauthorized" });
                }
                const { id } = decoded;
                console.log('req.user: ', req.user);

                const updatedUser = {
                    _id: req.user._id,
                    subscription: req.user.subscription,
                    email: req.user.email,
                    password: req.user.password
                }
                req.user.token = null;
                req.user = null;
                const resultUpdate = userModel.findOneAndReplace({ _id: id }, updatedUser, { new: true }, function (e, r) {
                    console.log('e: ', e);
                    console.log('r: ', r);
                });

                return res.status(204).send({ message: "No Content" });
            })
            // console.log()
        }
        catch (err) {
            next(err);
        }
        next();
    }

    async getCurrentUser(req, res, next) {
        if (req.user) {
            const { email, subscription } = req.user;
            return res.status(200).send({
                email, subscription
            });
        }
    }

    async updateSubscription(req, res, next) {
        try {
            console.log('req.user: ', req.user);
            const update = await userModel.findByIdAndUpdate(
                req.user._id,
                { $set: { subscription: req.body.subscription } },
                { new: true, runValidators: true }
            );
            return res.status(200).send({
                email: update.email,
                subscription: update.subscription
            });
        }
        catch (err) {
            next(err);
        }
        next();
    }
}

module.exports = new UserController();