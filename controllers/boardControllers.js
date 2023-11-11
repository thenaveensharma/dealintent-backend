const asyncHandler = require("express-async-handler");
const Board = require("../models/boardModel");
const isValidId = require("../services/validObjectId");

const { io } = require("../socket/index.js");
// Create a new board
const createBoard = asyncHandler(async function (req, res, next) {
  try {
    const { name, description } = req.body;
    // Check if name and description are provided
    if (!name || !description) {
      return res
        .status(400)
        .json({ error: "Name and description are required" });
    }
    const board = new Board({ name, description });
    const savedBoard = await board.save();

    // send board to all connected clients
    io.to(process.env.KANBAN_ROOM).emit("board:created", savedBoard);
    return res.status(201).json(savedBoard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a board by ID
const updateBoard = asyncHandler(async function (req, res) {
  try {
    const { name, description, isDefault } = req.body;
    // Check if name and description are provided
    if (!name || !description) {
      return res
        .status(400)
        .json({ error: "name and description are required" });
    }
    const { boardId } = req.params;
    // Check if boardId is provided
    if (!boardId) {
      return res.status(400).json({ error: "boardId is required" });
    }
    // Check if the boardId is a valid ObjectId
    if (!isValidId(boardId)) {
      return res.status(400).json({ error: "Invalid boardId format" });
    }
    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      { name, description, isDefault },
      { new: true }
    );
    if (!updatedBoard) {
      return res.status(404).json({ error: "Board not found" });
    }
    // send board to all connected clients
    io.to(process.env.KANBAN_ROOM).emit("board:updated", updatedBoard);
    res.json(updatedBoard);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});
const deleteBoard = asyncHandler(async function (req, res) {
  try {
    const { boardId } = req.params;
    // Check if boardId is provided
    if (!boardId) {
      return res.status(400).json({ error: "boardId is required" });
    }
    // Check if the boardId is a valid ObjectId
    if (!isValidId(boardId)) {
      return res.status(400).json({ error: "Invalid boardId format" });
    }
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Check if the board has isDefault as false before deletion
    if (!board.isDefault) {
      await Board.findByIdAndDelete(req.params.boardId);

      // send deleted board id to all connected clients
      io.to(process.env.KANBAN_ROOM).emit("board:deleted", {
        message: "Board deleted successfully",
        board: boardId,
      });
      res.json({ message: "Board deleted successfully" });
    } else {
      res.status(403).json({ error: "Cannot delete a default board" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all boards
const allBoards = asyncHandler(async function (req, res) {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { createBoard, updateBoard, deleteBoard, allBoards };
