import { Router } from "express";
import workout_plan_controller from "../../controller/workout_plan_controller";
const workout_plan_routes = Router();

workout_plan_routes.post(
  "/schedule/assign",
  workout_plan_controller.assign_exercise
);
workout_plan_routes.get(
  "/schedule/:workout_day_id",
  workout_plan_controller.get_exercise
);
workout_plan_routes.delete(
  "/schedule/remove/:id",
  workout_plan_controller.remove_exercise
);
workout_plan_routes.put(
  "/schedule/update",
  workout_plan_controller.update_exercise
);

workout_plan_routes.put(
  "/activate",
  workout_plan_controller.active_workout_plan
);

workout_plan_routes.get("/:id", workout_plan_controller.get_workout_plans);
workout_plan_routes.post("/add", workout_plan_controller.create_workout_plan);
workout_plan_routes.put("/update", workout_plan_controller.update_workout_plan);
workout_plan_routes.delete("/:id", workout_plan_controller.delete_workout_plan);

export default workout_plan_routes;
