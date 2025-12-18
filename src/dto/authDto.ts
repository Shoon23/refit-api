export interface LoginResponseDto {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  access_token: string;
  refresh_token: string;
  workout_plan: {
    id: string;
    name: string;
    workouts: { id: string; day: string }[];
  } | null;
  preferences: {
    id?: string;
    levels: string[];
    equipments: string[];
    muscles: string[];
  };
}
