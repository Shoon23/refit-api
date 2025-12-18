// mappers/v1/authMapper.ts

import { LoginResponseDto } from "../dto/authDto";

export const toUserAuth = (user: any, workout_plan: any): LoginResponseDto => {
  const { password: hash_password, preference, ...other } = user;

  return {
    ...other,
    workout_plan: workout_plan ?? null,
    access_token: "", // populate in service
    refresh_token: "", // populate in service
    preferences: preference
      ? {
          id: preference?.id,
          levels: preference?.levels.map((lvl: any) => lvl.name),
          equipments: preference?.equipments.map((eq: any) => eq.name),
          muscles: preference?.muscles.map((m: any) => m.name),
        }
      : null,
  };
};
