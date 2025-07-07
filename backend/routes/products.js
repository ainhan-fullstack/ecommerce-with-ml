const express = require("express");
const router = express.Router();
const pool = require("../config/db");

function getPagination(req) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const offset = (page - 1) * limit;
  const orderBy = req.query.orderBy || "id";
  const orderDir = req.query.orderDir || "asc";
  return { limit, offset, orderBy, orderDir };
}

function sendPaginated(res, rows, totalCount) {
  res.set("x-total-count", totalCount);
  res.set("Access-Control-Expose-Headers", "x-total-count");
  res.json(rows);
}

router.get("/products", async (req, res) => {
  try {
    const { limit, offset, orderBy, orderDir } = getPagination(req);

    const searchQuery = req.query.searchQuery || "";

    const params = [];
    let whereClause = "";

    if (searchQuery) {
      params.push(`%${searchQuery}%`);
      whereClause = `WHERE p.name ILIKE $1`;
    }

    const countResult = await pool.query(
      `SELECT COUNT(1) FROM ecommerce.products p ${whereClause}`,
      params
    );

    const totalCount = parseInt(countResult.rows[0].count, 10);

    params.push(limit, offset);
    const limitIdx = params.length - 1;
    const offsetIdx = params.length;

    const query = `
      Select p.*
      FROM ecommerce.products p
      ${whereClause}
      ORDER BY p.${orderBy} ${orderDir}
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;

    const results = await pool.query(query, params);

    sendPaginated(res, results.rows, totalCount);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

router.get("/products/:id", async (req, res) => {
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
    res.status(500).json({ message: "Error fetching product details" });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const { limit, offset, orderBy, orderDir } = getPagination(req);
    const searchQuery = req.query.searchQuery || "";
    const { category } = req.params;

    const params = [category];

    let whereClause = "WHERE lower(p.category) = lower($1)";

    if (searchQuery) {
      params.push(`%${searchQuery}%`);
      whereParts.push(` AND p.name ILIKE $${params.length}`);
    }

    const countResult = await pool.query(
      `SELECT COUNT(1) FROM ecommerce.products p ${whereClause}`,
      params
    );
    const totalCount = parseInt(countResult.rows[0].count, 10);

    params.push(limit, offset);
    const limitIdx = params.length - 1;
    const offsetIdx = params.length;

    const query = `
      Select p.*
      From ecommerce.products p
      ${whereClause}
      ORDER BY p.${orderBy} ${orderDir}
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;

    const results = await pool.query(query, params);
    sendPaginated(res, results.rows, totalCount);
  } catch (err) {
    res.status(500).json({ message: "Error fetching category." });
  }
});

module.exports = router;
