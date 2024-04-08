const Pool = require("pg").Pool;

// Configure pool to connect to PostgreSQL database
const pool = new Pool({
    user: "postgres",
    password : "anya1234",
    host: "localhost",
    port: 5432,
    database : "comp3005finalproj"
});

// Error handling
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports = pool;
