import fs from "fs";
import { err, ok, Result } from "../utils/result";
import { iExercises } from "../types/workout_types";

const readExercisesFile = async (): Promise<
  Result<iExercises, { message: string }>
> => {
  try {
    const data = fs.readFileSync(
      "public/exercises_data/exercises.json",
      "utf8"
    );
    const parsed = JSON.parse(data);
    return ok(parsed.workouts);
  } catch (error) {
    return err({ message: "Failed to read exercises data" });
  }
};

export default { readExercisesFile };
