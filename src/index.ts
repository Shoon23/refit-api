import createApp from "./app";

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
