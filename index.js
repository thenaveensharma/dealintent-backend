const { app, io, server, express } = require("./socket/index.js");
const cors = require("cors");
require("dotenv").config();
// connection to db is defined here
const { dbConnection } = require("./config");
dbConnection();
// not found and error handler middleware imports
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

//routes defined here
const routes = require("./api/routes.js");
const PORT = process.env.PORT || 8080;

// Define allowed origins for CORS
const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204 || 200,
  })
);
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("SERVER is running..");
});
app.use("/api", routes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

// Handle websocket connections
io.on("connection", (socket) => {
  console.log(socket.id);
  // Emit a 'connected' event when a client connects
  socket.join(process.env.KANBAN_ROOM);
  socket.emit("connected", `${socket.id} is connected`);
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
