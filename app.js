// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// CORS to allow cross origin resource sharing
const cors = require("cors");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();



// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);


// ℹ️ Configure CORS globally, allowing only localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',  // Permet uniquement l'origine de ton frontend
}));


// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const gameRoutes = require("./routes/game.routes");
app.use("/api", gameRoutes);

const requestRoutes = require("./routes/request.routes");
app.use("/api", requestRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
