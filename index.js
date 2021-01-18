const express = require('express');
const app = express();
const { json } = require('express');
const morgan = require('morgan');
const userRoutes = require('./src/users/user.router');
const ContactsService_v2 = require('./src/services/contact.service_v2');
const contactsRouter = require('./src/contacts/contact.routes');

require('dotenv').config();

const host = process.env.HOST;
const port = process.env.PORT || 443;
ContactsService_v2.dbConnect();

function logErrors(err, req, res, next) {
    console.error('logErrors: ', err);

    if (!err.status) {err.status = 400};
    if (err.code === 11000) {
        err.message = 'Contact already in database';
        err.status = 409;
    };

    return res.status(err.status).send(err.message);
    // next(err);
}

app.use(json());
app.use(morgan('combined'));
app.use('/', contactsRouter);
app.use('/', userRoutes);
app.use(logErrors);

app.listen(port, () =>
    console.log(`server is running on a port ${port}`)
)