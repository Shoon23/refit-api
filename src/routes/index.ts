import { Router } from "express";
import authV1 from "./v1/auth_routes";
import userV1 from "./v1/user_routes";
import workoutV1 from "./v1/workout_routes";
import workoutPlanV1 from "./v1/workout_plan_routes";
import verify_access from "../middleware/verify_access";

const router = Router();

router.use("/api/v1/auth", authV1);
router.use(verify_access);
router.use("/api/v1/users", userV1);
router.use("/api/v1/workouts", workoutV1);
router.use("/api/v1/workout-plans", workoutPlanV1);

export default router;
