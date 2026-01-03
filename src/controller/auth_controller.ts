import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  generate_access_jwt,
  generate_refresh_jwt,
  verify_refresh_jwt,
} from "../utils/jwt_utils";
import Joi, { preferences } from "joi";
import {
  equipment_types,
  level_types,
  muscle_groups,
} from "./workout_controller";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import authService from "../services/auth_service";

const Days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const login_schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]")).required(),
});

// login controller
async function login(req: Request, res: Response) {
  const { value, error } = login_schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = value;
  const result = await authService.login_user(email, password);
  if (!result.ok) {
    return res
      .status(result.error.status)
      .json({ message: result.error.message });
  }

  return res.status(200).json(result.value);
}

// register controller
const register_schema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]")).required(),
});
async function register(req: Request, res: Response) {
  const { value, error } = register_schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { first_name, last_name, email, password } = value;

  const result = await authService.register_user(
    first_name,
    last_name,
    email,
    password
  );

  if (!result.ok) {
    return res
      .status(result.error.status)
      .json({ message: result.error.message });
  }
  return res.status(200).json(result.value);
}

const refresh_token_schema = Joi.object({
  token: Joi.string().required(),
});

async function refresh_token(req: Request, res: Response) {
  const { value, error } = refresh_token_schema.validate(req.params);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const result = await authService.refresh_user(value.token);

  if (!result.ok) {
    return res
      .status(result.error.status)
      .json({ message: result.error.message });
  }
  return res.status(200).json(result.value);
}

export default {
  login,
  register,

  refresh_token,
};
