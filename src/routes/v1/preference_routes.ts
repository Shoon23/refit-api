import { Router } from "express";
import auth_controller from "../../controller/auth_controller";
import user_controller from "../../controller/preference_controller";
import verify_access from "../../middleware/verify_access";
const preference_routes = Router();
preference_routes.put("/preferences/update", user_controller.update_preference);
preference_routes.post(
  "/preferences",
  verify_access,
  user_controller.create_preference
);
export default preference_routes;
