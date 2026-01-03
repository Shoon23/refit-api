import { Router } from "express";
import user_controller from "../../controller/preference_controller";
const preference_routes = Router();
preference_routes.put("/", user_controller.update_preference);
preference_routes.post("/", user_controller.create_preference);
export default preference_routes;
