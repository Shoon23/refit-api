import { Router } from "express";
import authV1 from "./v1/auth_routes";
import preferenceV1 from "./v1/preference_routes";
import workoutV1 from "./v1/workout_routes";
import workoutPlanV1 from "./v1/workout_plan_routes";
import verify_access from "../middleware/verify_access";

const routes = Router();
routes.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: "Server is healthy",
  });
});
routes.use("/auth", authV1);
routes.use(verify_access);
routes.use("/preferences", preferenceV1);
routes.use("/workouts", workoutV1);
routes.use("/workout_plan", workoutPlanV1);

export default routes;
