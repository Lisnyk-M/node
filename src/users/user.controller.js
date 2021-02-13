const crypto = require('crypto');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const contactValidator = require('../validators/contact.validator');
const userRegisterSchema = require('../schemas/user.register.schema');
// const idSchema = require('../schemas/id.schema');
const { json } = require('express');
const generateAvatar = require('../helpers/avatarGenerator');
const fs = require('fs').promises;
const path = require('path');
const { v4 } = require('uuid');
const { NotFoundError, UnauthorizedError } = require('../helpers/errors.constructor');
const userModel = require('../users/user.model');
const Token = require('../token/Token');
const sendVerificationEmail = require('../helpers/sendMailer_v2');


const SALT_FACTOR = 8;

class UserController {
    async getUserById(req, res) {
        try {
            const user = await userModel.getById(req.user._id);
            if (!user) {
                res.status(400)
                return res.json({ message: `No user with id ${req.user._id} not found.` });
            }
            res.json({ user });
        }
        catch (err) {
        }
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
            console.log('newContact: ', newContact);

            if (newContact) {
                const verificationToken = await crypto.randomBytes(16).toString('hex');

                await Token.create({
                    verificationToken,
                    userId: newContact._id
                })

                await sendVerificationEmail(req.body.email, verificationToken);

                const idImage = newContact._id;
                await generateAvatar(req.body.email);
                await fs.copyFile(path.join(__dirname, '../../tmp/tmp.svg'),
                    path.join(__dirname, `../../public/images/${idImage}.svg`));

                const avatarURL = `${req.headers.host}/images/${idImage}.svg`;
                req.body.avatarURL = avatarURL;
                responseBody.user.avatarURL = avatarURL;
                await userModel.findByIdAndUpdate(
                    newContact._id,
                    { $set: { avatarURL } },
                    { new: true, runValidators: true }
                );
            }

            return newContact
                ? res.status(201).send(responseBody)
                : res.status(400).send({ message: "error create user" });

        } catch (err) {
            next(err);
        }
        next();
    }

    async verifyUser(req, res, next) {
        const { params: { verificationToken } } = req;
        const tokenData = await Token.findOne({
            verificationToken
        })

        if (!tokenData) {
            return res.status(404).send("Not found");
        }

        const user = await userModel.findById(tokenData.userId);

        if (!user) {
            return res.status(404).send("Not found");
        }

        user.verified = true;
        await user.save();

        res.send("Your verification is successfull!");
        //удалити токен щоб два рази ссилка не зпрацьовувала
        await Token.updateOne({ verificationToken }, { $set: { verificationToken: null } });
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
            if (!req.existingUser.verified) {
                return res.status(400).send('Your email not verified. Please check your email');
            }

            const token = jwt.sign({ id: req.existingUser._id }, process.env.JWT_SECRET, {
                expiresIn: '2 days'
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
            const decoded = jwt.verify(req.token, process.env.JWT_SECRET);
            if (!decoded) {
                return res.status(401).send({ message: "Unauthorized" });
            }
            const { id } = decoded;
            const updatedUser = {
                _id: req.user._id,
                subscription: req.user.subscription,
                email: req.user.email,
                password: req.user.password,
                avatarURL: req.user.avatarURL
            }
            req.user.token = null;
            req.user = null;
            await userModel.findOneAndReplace({ _id: id }, updatedUser, { new: true });

            return res.status(204).send({ message: "No Content" });
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