const asyncHandler = require("express-async-handler");
const Board = require("../models/boardModel");
const Task = require("../models/taskModel");
const isValidId = require("../services/validObjectId");
const { io } = require("../socket/index.js");

// Create a new task
const createTask = asyncHandler(async function (req, res, next) {
  try {
    const { name, description, dueDate, board } = req.body;

    // Check if required properties are provided
    if (!name || !description || !dueDate || !board) {
      return res.status(400).json({
        error: "name, description, dueDate, and board are required",
      });
    }

    // Check if the board is valid
    const isBoard = await Board.findById(board);
    if (!isBoard) {
      return res.status(404).json({ error: "Board not found" });
    }

    let task = new Task({ name, description, dueDate, board });
    task = await task.populate("board");
    const savedTask = await task.save();
    // send task to all connected clients
    io.to(process.env.KANBAN_ROOM).emit("task:created", savedTask);
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task by ID
const updateTask = asyncHandler(async function (req, res, next) {
  try {
    const { name, description, dueDate, board } = req.body;
    const { taskId } = req.params;

    // Check if required properties are provided
    if (!name || !description || !dueDate || !board) {
      return res.status(400).json({
        error: "name, description, dueDate, and board are required",
      });
    }
    // Check if the board is a valid ObjectId
    if (!isValidId(board)) {
      return res.status(400).json({ error: "Invalid board format" });
    }
    // Check if the taskId is a valid ObjectId
    if (!isValidId(taskId)) {
      return res.status(400).json({ error: "Invalid taskId format" });
    }
    // Check if the board is valid
    const isBoard = await Board.findById(board);
    if (!isBoard) {
      return res.status(404).json({ error: "Board not found" });
    }

    let updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { name, description, dueDate, board },
      { new: true }
    );
    updatedTask = await updatedTask.populate("board");
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    // send task to all connected clients
    io.to(process.env.KANBAN_ROOM).emit("task:updated", updatedTask);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a task by ID
const deleteTask = asyncHandler(async function (req, res, next) {
  try {
    const { taskId } = req.params;
    // Check if required properties are provided
    if (!taskId) {
      return res.status(400).json({
        error: "taskId is required",
      });
    }
    // Check if the taskId is a valid ObjectId
    if (!isValidId(taskId)) {
      return res.status(400).json({ error: "Invalid taskId format" });
    }
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.taskId);
    // send deleted tassk id to all connected clients
    io.to(process.env.KANBAN_ROOM).emit("task:deleted", {
      message: "Board deleted successfully",
      task: taskId,
    });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tasks
const allTasks = asyncHandler(async function (req, res, next) {
  try {
    const tasks = await Task.find().populate("board");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = {
  createTask,
  updateTask,
  deleteTask,
  allTasks,
};
