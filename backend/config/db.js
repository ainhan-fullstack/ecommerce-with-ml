const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'ecommerce',
//   password: 'admin',
//   port: 5432,
// });

module.exports = pool;