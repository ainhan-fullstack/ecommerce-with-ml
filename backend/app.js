const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({path: require('path').resolve(__dirname, '../.env')});

const app = express();
const paymentRoutes = require('./routes/payment');

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => res.send('Homepage!'));

app.use('/api', paymentRoutes);

module.exports = app;