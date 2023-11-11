"use strict";
const express = require("express");
const router = express.Router();
// Controllers
const board = require("../controllers/boardControllers.js");
const task = require("../controllers/taskControllers.js");

// Board's API routes
router.post("/boards", board.createBoard);
router.get("/boards", board.allBoards);
router.put("/boards/:boardId", board.updateBoard);
router.delete("/boards/:boardId", board.deleteBoard);

// Task's API routes
router.post("/tasks", task.createTask);
router.get("/tasks", task.allTasks);
router.put("/tasks/:taskId", task.updateTask);
router.delete("/tasks/:taskId", task.deleteTask);

module.exports = router;
