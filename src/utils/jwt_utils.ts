import jwt from "jsonwebtoken";
import { err, ok } from "./result";

const generate_access_jwt = (id: string) => {
  const secret = process.env.JWT_SECRET_ACCESS;
  if (!secret) return err({ message: "Missing access token secret" });

  try {
    const token = jwt.sign({ id }, secret, { expiresIn: "1h" });
    return ok(token);
  } catch (error) {
    return err({ message: "Failed to generate access token" });
  }
};

const generate_refresh_jwt = (id: string) => {
  const secret = process.env.JWT_SECRET_REFRESH;
  if (!secret) return err({ message: "Missing refresh token secret" });

  try {
    const token = jwt.sign({ id }, secret);
    return ok(token);
  } catch (error) {
    return err({ message: "Failed to generate refresh token" });
  }
};

const verify_access_jwt = (token: string) => {
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_ACCESS as string
    ) as { id: string };
    return ok(payload);
  } catch (error) {
    return err({ message: "Invalid or expired access token" });
  }
};

const verify_refresh_jwt = (token: string) => {
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_REFRESH as string
    ) as { id: string };
    return ok(payload);
  } catch (error) {
    return err({ message: "Invalid refresh token" });
  }
};

export {
  verify_refresh_jwt,
  generate_access_jwt,
  verify_access_jwt,
  generate_refresh_jwt,
};
