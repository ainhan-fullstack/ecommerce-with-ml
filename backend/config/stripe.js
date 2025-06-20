require('dotenv').config({path: require('path').resolve(__dirname, '../../.env')});

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SCRET_KEY);

module.exports = stripe;