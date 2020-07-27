/** Database config for database. */


const { Client } = require("pg");
const {DB_URI} = require("./config");

let db = new Client({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  database: DB_URI,
  port: 5432
});

db.connect();


module.exports = db;
