const express = require('express');
const router = express.Router();
const contactsRoutes = require('./contacts.routes');

router.use('/contacts', contactsRoutes);

module.exports = router;