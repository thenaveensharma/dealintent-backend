const mongoose = require("mongoose");
// function to handle invalid object id
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports = isValidId;
