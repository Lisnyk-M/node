const Router = require('express').Router;
const filesRouter = Router();
const fs = require('fs').promises;
const path = require('path');
const userController = require('./user.controller');
const userModel = require('./user.model');
const { upload } = require('./files.controller');
const userAuthorise = require('./user.authorisation');
const userValidate = require('./user.validate');
const multer = require('multer');

const storageAvatar = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('req.user: ', req.user);
        cb(null, path.resolve('./uploads'));
    },
    filename: (req, file, cb) => {
        const newName = `${req.user._id}${path.extname(file.originalname)}`;
        cb(null, newName);
        req.user.uploadedImageName = newName;
    }
});

const uploadAvatarMiddleware = multer({ storage: storageAvatar });
const cupload = uploadAvatarMiddleware.single('avatar');

filesRouter.patch('/users/avatars', userAuthorise, function (req, res) {
    cupload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: "error" });
        }

        const { dir, name, base } = path.parse(req.user.avatarURL); //in DB
        const xPath = path.join(req.headers.host, '/images', base);
        console.log('xPath: ', xPath);
        console.log('name: ', name);

        //move file from uploads dir to public/images dir
        await fs.rename(path.join(__dirname, `../../uploads/${req.user.uploadedImageName}`),
            path.join(__dirname, `../../public/images/${req.user.uploadedImageName}`));

        const parseUploadedName = path.parse(req.user.uploadedImageName);
        const newName = `${req.headers.host}/images/${name}${parseUploadedName.ext}`;

        await userModel.findByIdAndUpdate(
            req.user._id,
            { $set: { avatarURL: newName } },
            { new: true, runValidators: true }
        );

        return res.status(201).json({ avatarURL: newName });
    })
});

module.exports = filesRouter;