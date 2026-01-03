import bcrypt from "bcrypt";
import auth_repo from "../repository/auth_repo";
import {
  generate_access_jwt,
  generate_refresh_jwt,
  verify_refresh_jwt,
} from "../utils/jwt_utils";
import { err, ok } from "../utils/result";
import { toUserAuth } from "../mapper/authMapper";

const login_user = async (email: string, password: string) => {
  const user_result = await auth_repo.find_user_by_email(email);

  if (!user_result.ok) return user_result;
  const user = user_result.value;
  if (!user) return err({ status: 401, message: "User is not yet registered" });

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) return err({ status: 401, message: "Wrong Password" });

  const workout_plan_res = await auth_repo.find_active_workout_plan_by_userId(
    user.id
  );

  if (!workout_plan_res.ok) return workout_plan_res;

  const access_result = generate_access_jwt(user.id);
  if (!access_result.ok)
    return err({ status: 500, message: access_result.error.message });

  const refresh_result = generate_refresh_jwt(user.id);
  if (!refresh_result.ok)
    return err({ status: 500, message: refresh_result.error.message });
  const response_DTO = toUserAuth(user, workout_plan_res.value);

  response_DTO.access_token = access_result.value;
  response_DTO.refresh_token = refresh_result.value;

  return ok(response_DTO);
};

const register_user = async (
  first_name: string,
  last_name: string,
  email: string,
  password: string
) => {
  const salt_rounds = 10;

  const user_result = await auth_repo.find_user_by_email(email);

  if (!user_result.ok) return user_result;

  if (user_result.value)
    return err({ status: 409, message: "User Already Exists" });

  const hash_password = await bcrypt.hash(password, salt_rounds);

  const created_user = await auth_repo.create_user(
    first_name,
    last_name,
    email,
    hash_password
  );

  if (!created_user.ok) return created_user;
  const accessResult = generate_access_jwt(created_user.value.id);
  if (!accessResult.ok)
    return err({ status: 500, message: accessResult.error.message });

  const refreshResult = generate_refresh_jwt(created_user.value.id);
  if (!refreshResult.ok)
    return err({ status: 500, message: refreshResult.error.message });
  const response_DTO = toUserAuth(created_user.value, null);

  response_DTO.access_token = accessResult.value;
  response_DTO.refresh_token = refreshResult.value;
  return ok(response_DTO);
};

const refresh_user = async (token: string) => {
  const result = verify_refresh_jwt(token);
  if (!result.ok)
    return err({
      status: 401,
      message: result.error.message,
    });
  const user_id = result.value.id;

  const user_result = await auth_repo.find_user_by_id(user_id);

  if (!user_result.ok) return user_result;
  const user = user_result.value;
  if (!user) return err({ status: 401, message: "User not found" });

  const workout_plan_res = await auth_repo.find_active_workout_plan_by_userId(
    user.id
  );

  if (!workout_plan_res.ok) return workout_plan_res;

  const access_result = generate_access_jwt(user.id);
  if (!access_result.ok)
    return err({ status: 500, message: access_result.error.message });

  const response_DTO = toUserAuth(user, workout_plan_res.value);

  response_DTO.access_token = access_result.value;

  return ok(response_DTO);
};
export default { login_user, register_user, refresh_user };
