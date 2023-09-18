const { Pool } = require("pg");

let pool;

if (process.env.NODE_ENV === "production") {
  // Heroku provides the DATABASE_URL environment variable
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Necessary if you're using Heroku's default SSL configuration
    },
  });
} else {
  // Use your local development database configuration
  pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: process.env.LOCAL_PASSWORD,
    port: 5432,
  });
}

module.exports = pool;
