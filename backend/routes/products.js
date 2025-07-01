const express = require("express");
const route = express.Router();
const pool = require("../config/db");

route.get("/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const searchQuery = req.query.searchQuery || "";
    const offset = (page - 1) * limit;
    const orderBy = req.query.orderBy || "id";
    const orderDir = req.query.orderDir || "asc";

    let baseQuery = `
      Select p.*
      From ecommerce.products p
      Where 1 = 1
    `;

    let whereClause = "";
    let params = [limit, offset];

    if (searchQuery) {
      whereClause = "AND p.name ILIKE $3";
      params.push(`%${searchQuery}%`);
    }

    const countResult = await pool.query(
      `Select Count(1) From ecommerce.products ${
        searchQuery ? "WHERE name ILIKE $1" : ""
      }`,
      searchQuery ? [`%${searchQuery}%`] : []
    );

    const totalCount = parseInt(countResult.rows[0].count, 10);

    const results = await pool.query(
      `
        ${baseQuery}
        ${whereClause}
        GROUP BY p.id
        ORDER BY p.${orderBy} ${orderDir}
        LIMIT $1 OFFSET $2
      `,
      params
    );

    res.set("x-total-count", totalCount);
    res.set("Access-Control-Expose-Headers", "x-total-count");
    res.json(results.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" + err });
  }
});

route.get("/products/:category", async (req, res) => {
  const category = req.params.category;

  try {
    const results = await pool.query(
      `
    Select p.*
    From ecommerce.products p
    where category = $1
    `,
      [category]
    );

    res.json(results.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching category." });
  }
});

route.get("/product/:id", async (req, res) => {
  try {
    const product_id = req.params.id;
    const result = await pool.query(
      `
        Select p.*,
        COALESCE(json_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), '[]') as images
        From ecommerce.products p
        Left Join ecommerce.product_images pi on p.id = pi.product_id
        Where p.id = $1
        Group By p.id
        `,
      [product_id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

module.exports = route;
