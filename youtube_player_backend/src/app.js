


const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth_routes");

const app = express();
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use(helmet());                  // Security headers
app.use(express.json());            // Parse JSON
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));            // Read cookies

app.use("/api/auth", authRoutes);

module.exports = app;
