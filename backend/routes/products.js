const express = require("express");
const route = express.Router();
const pool = require("../config/db");

route.get("/products", async (req, res) => {
  try {
    const result = await pool.query(`
        Select p.*,
        COALESCE(json_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), '[]') as images
        From ecommerce.products p
        Left Join ecommerce.product_images pi on p.id = pi.product_id
        Group By p.id
        Order by p.id DESC
        `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

module.exports = route;
