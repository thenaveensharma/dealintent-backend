const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const taskModel = mongoose.model("Task", taskSchema);
module.exports = taskModel;
