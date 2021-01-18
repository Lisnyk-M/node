const Router = require('express').Router;
const usersRouter = Router();
const userController = require('./user.controller');
const userAuthorise = require('./user.authorisation');
const userValidate = require('./user.validate');

usersRouter.post('/auth/register', userController.registerUser);
// usersRouter.get('/auth/register', userController.getRegisteredUsers);
usersRouter.post('/auth/login', userValidate, userController.userLogin);
usersRouter.post('/auth/logout', userAuthorise, userController.userLogout);
usersRouter.get('/users/current', userAuthorise, userController.getCurrentUser);
// usersRouter.get('/users', userController.getRegisteredUsers);
// usersRouter.get('/users/:userId', userController.getUserById);
usersRouter.patch('/users/', userAuthorise, userController.updateSubscription);

module.exports = usersRouter;