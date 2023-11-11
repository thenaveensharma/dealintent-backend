const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    isDefault: { type: Boolean, required: true,default:false },
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
