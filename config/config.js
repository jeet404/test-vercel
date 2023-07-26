require("dotenv").config();

module.exports = {
  database: {
    database: process.env.DB_NAME || "unikwork_board",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql",
  },
  certificate: {
    privkey: process.env.PRIVKEY_PATH || "path to priv key",
    fullchain: process.env.FULLCHAIN_PATH || "path to fullchain key",
  },
  protocol: process.env.PROTOCOL || "http",
  port: process.env.APP_PORT || 5050,
  mode: process.env.MODE || "local",
};
