const express = require('express');
const app = express();
const { json } = require('express');
const morgan = require('morgan');
const routes = require('./routes/index');

require('dotenv').config();

const host = process.env.HOST;
const port = process.env.PORT || 2000;

app.use(json());
app.use(morgan('combined'));
app.use('/api', routes);

app.listen(port, host, () =>
    console.log(`Server listens http://${host}:${port}`)
)