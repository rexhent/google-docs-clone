// Document.js
const { Pool } = require("pg");
const dotenv = require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

async function createDocumentSchema() {
  const query = `
    CREATE TABLE IF NOT EXISTS documents (
      _id VARCHAR PRIMARY KEY,
      data JSONB
    );
  `;

  await pool.query(query);
}

module.exports = {
  createDocumentSchema,
  pool,
};
