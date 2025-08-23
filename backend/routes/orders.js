const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const stripe = require("../config/stripe");
const verifyToken = require("../middleware/auth");
const { verify } = require("jsonwebtoken");

router.post("/orders", verifyToken, async (req, res) => {
  const { items = [], delivery_fee = 0 } = req.body;
  const userId = req.user.id;

  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ message: "Order items required." });

  try {
    let total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    total += parseFloat(delivery_fee);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "aud",
      payment_method_types: ["card"],
    });

    const orderRes = await pool.query(
      `
      INSERT INTO ecommerce.orders (user_id, total_amount, status, stripe_payment_intent, payment_status)
      VALUES ($1, $2, $3, $4, $5) RETURNING id
      `,
      [userId, total, "pending", paymentIntent.id, paymentIntent.status]
    );

    const orderId = orderRes.rows[0].id;

    const insertPromises = items.map((item) =>
      pool.query(
        `
        INSERT INTO ecommerce.order_items(order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)
        `,
        [orderId, item.product_id, item.quantity, item.price]
      )
    );
    await Promise.all(insertPromises);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      order_id: orderId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error." });
  }
});

router.get("/orders", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows: orders } = await pool.query(
      `
    Select * From ecommerce.orders Where user_id = $1 ORDER BY created_at DESC
    `,
      [userId]
    );

    const orderIds = orders.map((order) => order.id);

    if (orderIds.length === 0) return res.json([]);

    const { rows: items } = await pool.query(
      `
    Select * FROM ecommerce.order_items WHERE order_id = ANY($1::int[])
    `,
      [orderIds]
    );

    const orderWithItems = orders.map((order) => ({
      ...order,
      items: items.filter((item) => item.order_id === order.id),
    }));

    res.json(orderWithItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error." });
  }
});

router.post("/cancel-order", verifyToken, async (req, res) => {
  const orderId = req.body.orderId;
  if (orderId) {
    try {
      await pool.query(
        `UPDATE ecommerce.orders SET status='canceled' WHERE id = $1`,
        [orderId]
      );
      res.status(200).json({ message: "Canceled order successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
    }
  }
  res.status(400).json({ message: "Bad Request." });
});

module.exports = router;
