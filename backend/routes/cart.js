const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verifyToken = require("../middleware/auth");

const buildCart = async (userId) => {
  const cartRes = await pool.query(
    `Select id, delivery_method, delivery_fee FROM ecommerce.carts where user_id = $1`,
    [userId]
  );

  if (cartRes.rows.length === 0) {
    return {
      id: null,
      products: [],
      total: 0,
      discountedTotal: 0,
      userId,
      deliveryMethod: null,
      deliveryFee: 0,
      totalProducts: 0,
      totalQuantity: 0,
      grandTotal: 0,
    };
  }

  const cartId = cartRes.rows[0].id;
  const deliveryMethod = cartRes.rows[0].delivery_method || null;
  const deliveryFee = cartRes.rows[0].delivery_fee || 0;

  const itemRes = await pool.query(
    `
    Select ci.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock_quantity
    From ecommerce.cart_items ci
    JOIN ecommerce.products p ON ci.product_id = p.id
    Where ci.cart_id = $1
    `,
    [cartId]
  );

  const products = itemRes.rows.map((row) => {
    const total = parseFloat(row.price) * row.quantity;
    return {
      id: row.product_id,
      title: row.name,
      price: parseFloat(row.price),
      quantity: row.quantity,
      total,
      discountPercentage: 0,
      discountedTotal: total,
      thumbnail: row.image_url,
      stock_quantity: row.stock_quantity,
    };
  });

  const total = products.reduce((sum, p) => sum + p.total, 0);
  const discountedTotal = products.reduce(
    (sum, p) => sum + p.discountedTotal,
    0
  );
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const grandTotal = total + parseFloat(deliveryFee);

  return {
    id: cartId,
    products,
    total,
    discountedTotal,
    userId,
    deliveryMethod,
    deliveryFee,
    totalProducts: products.length,
    totalQuantity,
    grandTotal,
  };
};

router.get("/cart", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await buildCart(userId);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server Error." });
  }
});

router.post("/cart", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity)
    return res.status(400).json({ message: "Product and quantity required." });

  try {
    const cartRes = await pool.query(
      `
        Select id From ecommerce.carts where user_id = $1
        `,
      [userId]
    );

    let cartId;
    if (cartRes.rows.length === 0) {
      const insertCart = await pool.query(
        `
        INSERT INTO ecommerce.carts(user_id, delivery_method, delivery_fee) VALUES($1, $2, $3) RETURNING id
        `,
        [userId, null, 0]
      );
      cartId = insertCart.rows[0].id;
    } else {
      cartId = cartRes.rows[0].id;
    }

    const itemRes = await pool.query(
      `
        SELECT id, quantity
        FROM ecommerce.cart_items
        WHERE cart_id = $1 and product_id = $2
        `,
      [cartId, product_id]
    );

    if (itemRes.rows.length > 0) {
      const newQty = itemRes.rows[0].quantity + quantity;
      await pool.query(
        `
            UPDATE ecommerce.cart_items SET quantity = $1 WHERE id = $2
            `,
        [newQty, itemRes.rows[0].id]
      );
    } else {
      await pool.query(
        `
            INSERT INTO ecommerce.cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)
            `,
        [cartId, product_id, quantity]
      );
    }

    const cart = await buildCart(userId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server Error." });
  }
});

router.post("/cart/delivery", verifyToken, async (req, res) => {
  const { delivery_method, delivery_fee } = req.body;
  const userId = req.user.id;

  if (!delivery_method || delivery_fee === undefined)
    return res
      .status(400)
      .json({ message: "Delevery method and delivery fee required." });
  try {
    const cartRes = await pool.query(
      `
    Select id from ecommerce.carts where user_id = $1
    `,
      [userId]
    );

    let cartId;

    if (cartRes.rows.length === 0) {
      const newCart = await pool.query(
        `
      INSERT INTO ecommerce.carts (user_id, delivery_method, delivery_fee) VALUES($1, $2, $3) RETURNING id
      `,
        [userId, null, 0]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartRes.rows[0].id;
      await pool.query(
        `
      UPDATE ecommerce.carts SET delivery_method = $1, delivery_fee = $2 where id = $3
      `,
        [delivery_method, delivery_fee, cartId]
      );
    }

    const cart = await buildCart(userId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server Error." });
  }
});

module.exports = router;
