const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const Board = require("../models/boardModel");
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("connected to the db");
  } catch (error) {
    console.log("dbConnection ~ error:", error);
  }
};
dbConnection();
const seedBoards = async () => {
  try {
    await Board.deleteMany(); // Clear existing data
    let createdBoards = [];
    const boardsData = [
      {
        name: "To Do",
        description: "Tasks we need to do, but haven't started planning yet.",
        isDefault: true,
      },
      {
        name: "In Progress",
        description: "Tasks we're actively working on right now.",
        isDefault: true,
      },
      {
        name: "Completed",
        description: "Tasks we've finished and can check off our list.",
        isDefault: true,
      },
    ];
    for (let index = 0; index < boardsData.length; index++) {
      const element = boardsData[index];
      const newBoard = await Board.create({
        name: element.name,
        description: element.description,
        isDefault: element.isDefault,
      });

      createdBoards.push(newBoard);
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    console.log("disconnecting...");
    mongoose.disconnect();
    console.log("disconnected successfully");
  }
};

seedBoards();
