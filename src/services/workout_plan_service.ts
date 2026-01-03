import {
  IAssignExerciseInput,
  ICreateWorkoutPlanInput,
  IUpdateExerciseInput,
  IUpdateWorkoutPlanInput,
} from "../controller/workout_plan_controller";
import workout_plan_repo from "../repository/workout_plan_repo";
import workout_repo from "../repository/workout_repo";
import { prisma } from "../lib/prisma";
import { err, ok } from "../utils/result";

const assign_exercise = async (data: IAssignExerciseInput) => {
  const workoutSchedule = await workout_plan_repo.find_workout_schedule(
    data.workout_day_id
  );

  if (!workoutSchedule.ok) return workoutSchedule;
  if (!workoutSchedule.value)
    return err({
      status: 404,
      message: "Missign Schedule",
    });

  const added_exercise = await workout_plan_repo.add_exercise_to_day(
    data.workout_day_id,
    data.reps,
    data.sets,
    data.detail_id
  );

  if (!added_exercise.ok) return added_exercise;

  return ok(added_exercise.value);
};

const get_exercise = async (id: string) => {
  const workout_day = await workout_plan_repo.find_workout_schedule(id);

  if (!workout_day.ok) return workout_day;

  if (!workout_day.value)
    return err({ status: 404, message: "Missing Exercise" });

  const workoutList = await workout_repo.readExercisesFile();

  if (!workoutList.ok) return workoutList;

  const result: any = [];

  workout_day.value.exercises.forEach((excercise) => {
    const workout = workoutList.value.find(
      (workout) =>
        workout.id.toLowerCase() === excercise.detail_id.toLowerCase()
    );

    if (workout) {
      const { detail_id, ...rest } = excercise;

      result.push({
        ...rest,
        details: workout,
      });
    }
  });

  const { exercises, ...rest } = workout_day.value;

  return ok({ ...rest, exercises: result });
};

const remove_exercise = async (id: string) => {
  const exercise = await workout_plan_repo.remove_exercise_to_day(id);

  if (!exercise.ok) return exercise;

  return ok(null);
};

const update_exercise = async (data: IUpdateExerciseInput) => {
  const exercise = await workout_plan_repo.update_exercise_to_day(data);

  if (!exercise.ok) return exercise;

  return ok(null);
};

const create_workout_plan = async (data: ICreateWorkoutPlanInput) => {
  const workout_plan = await workout_plan_repo.create_workout_plan_with_day(
    data
  );

  if (!workout_plan.ok) return workout_plan;

  return workout_plan;
};

const delete_workout_plan = async (id: string) => {
  const workout_plan = await workout_plan_repo.delete_workout_plan(id);

  return workout_plan;
};
const update_workout_plan = async (data: IUpdateWorkoutPlanInput) => {
  const workout_plan = await workout_plan_repo.update_workout_plan(data);

  return workout_plan;
};

const get_workout_plans = async (
  id: string,
  query: {
    page_size: number;
    page_number: number;
  }
) => {
  const work_out_plans = await workout_plan_repo.find_workout_plans(id, query);

  return work_out_plans;
};

const active_workout_plan = async (new_wp_id: string, old_wp_id: string) => {
  const workout_plan = await workout_plan_repo.activate_workout_plan(
    new_wp_id,
    old_wp_id
  );

  if (!workout_plan.ok) return workout_plan;

  return ok({ message: "Success" });
};
export default {
  assign_exercise,
  get_exercise,
  remove_exercise,
  update_exercise,
  create_workout_plan,
  delete_workout_plan,
  get_workout_plans,
  update_workout_plan,
  active_workout_plan,
};
