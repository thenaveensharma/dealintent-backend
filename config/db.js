const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("connected to the db");
  } catch (error) {
    console.log("🚀 ~ file: db.js:8 ~ dbConnection ~ error:", error);
  }
};
module.exports = dbConnection;
