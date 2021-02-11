const Router = require('express').Router;
const usersRouter = Router();
const path = require('path');
const userController = require('./user.controller');
const userAuthorise = require('./user.authorisation');
const userValidate = require('./user.validate');


usersRouter.get('/', (req, res, next) => {
    res.sendFile(path.join( __dirname, '../../index.html' ));
});

usersRouter.post('/auth/register', userController.registerUser);
// usersRouter.get('/auth/register', userController.getRegisteredUsers);
usersRouter.post('/auth/login', userValidate, userController.userLogin);
usersRouter.post('/auth/logout', userAuthorise, userController.userLogout);
usersRouter.get('/users/current', userAuthorise, userController.getCurrentUser);
usersRouter.get('/users', userController.getRegisteredUsers);
// usersRouter.get('/users/:userId', userController.getUserById);
usersRouter.get('/me', userController.getUserById);
usersRouter.patch('/users/', userAuthorise, userController.updateSubscription);
usersRouter.get('/auth/verify/:verificationToken', userController.verifyUser);  //  /users/verify
// usersRouter.patch('/users/avatars', userAuthorise, userController.updateAvatar);

module.exports = usersRouter;