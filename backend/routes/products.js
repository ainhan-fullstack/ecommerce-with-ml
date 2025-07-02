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
    const category = req.query.category || "";

    let baseQuery = `
      Select p.*
      From ecommerce.products p
    `;

    let whereParts = [];
    let params = [];
    let paramsIdx = 1;

    if (searchQuery) {
      whereParts.push(`p.name ILIKE $${paramsIdx++}`);
      params.push(`%${searchQuery}%`);
    }

    if (category) {
      whereParts.push(`lower(p.category) = lower($${paramsIdx++})`);
      params.push(category);
    }

    const whereClause =
      whereParts.length > 0 ? "WHERE " + whereParts.join(" AND ") : "";

    const countResult = await pool.query(
      `SELECT COUNT(1) FROM ecommerce.products p ${whereClause}`,
      params
    );

    const totalCount = parseInt(countResult.rows[0].count, 10);

    params.push(limit, offset);

    const results = await pool.query(
      `
        ${baseQuery}
        ${whereClause}
        GROUP BY p.id
        ORDER BY p.${orderBy} ${orderDir}
        LIMIT $${params.length - 1} OFFSET $${params.length}
      `,
      params
    );

    console.log(
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

route.get("/products/:id", async (req, res) => {
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

// route.get("/products/:category", async (req, res) => {
//   const category = req.params.category;

//   try {
//     const results = await pool.query(
//       `
//     Select p.*
//     From ecommerce.products p
//     where lower(p.category) = lower($1)
//     `,
//       [category]
//     );

//     res.json(results.rows);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching category." });
//   }
// });

module.exports = route;
