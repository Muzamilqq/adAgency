const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("../backend/routes/auth");
const campaignRoutes = require("../backend/routes/campaigns");
const aiRoutes = require("../backend/routes/ai");
const userRoutes = require("../backend/routes/users");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(compression());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/ai", aiRoutes);

module.exports = app;
