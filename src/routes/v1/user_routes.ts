import { Router } from "express";
import auth_controller from "../../controller/auth_controller";
import user_controller from "../../controller/user_controller";
import verify_access from "../../middleware/verify_access";
const user_routes = Router();
user_routes.put("/preferences/update", user_controller.update_preference);
user_routes.post(
  "/preferences",
  verify_access,
  user_controller.create_preference
);
export default user_routes;
