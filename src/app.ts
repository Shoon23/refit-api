import express from "express";
import cors from "cors";

import routes from "./routes";

const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Static files
  app.use(
    "/exercises_img",
    express.static("public/exercises_data/exercises_img")
  );
  app.use("/info_img", express.static("public/info_img"));

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(), // seconds since server started
      timestamp: new Date().toISOString(),
      message: "Server is healthy",
    });
  });
  // Routes
  app.use(routes);

  return app;
};

export default createApp;
