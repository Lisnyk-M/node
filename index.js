const express = require('express');
const app = express();
const { json } = require('express');
const morgan = require('morgan');
const routes = require('./src/routes/index');

require('dotenv').config();

// const host = process.env.HOST;
const port = process.env.PORT || 8080;

app.use(json());
app.use(morgan('combined'));
app.use('/api', routes);

app.get('/', function(req, res) {
    res.render('index.html');
});


app.listen(port,  () =>
    // console.log(`Server listens http://${host}:${port}`)
    console.log('is running xa-xa-xa')
)