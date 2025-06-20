const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const pool = require('../config/db');

router.post('/create-payment', async (req, res) => {
    const {user_id, amount} = req.body;

    if (!user_id || !amount) {
        return res.status(400).json({
            error: 'Missing required fields.'
        });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'aud',
            payment_method_types: ['card']
        });

        const orderQuery = `
            INSERT INTO ecommerce.orders (user_id, total_amount, status, stripe_payment_intent, payment_status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const values = [user_id, amount, 'pending', paymentIntent.id, paymentIntent.status];

        const { rows } = await pool.query(orderQuery, values);
        const newOrder= rows[0];
        
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            order: newOrder
        });

    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({error: 'Payment initialisation failed.'});
    }
});

module.exports = router;