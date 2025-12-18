import { Router } from "express";
import auth_controller from "../../controller/auth_controller";
import user_controller from "../../controller/user_controller";
import verify_access from "../../middleware/verify_access";

const auth_routes = Router();

auth_routes.post("/login", auth_controller.login);
auth_routes.post("/register", auth_controller.register);
auth_routes.get("/refresh/:token", auth_controller.refresh_token);

export default auth_routes;
