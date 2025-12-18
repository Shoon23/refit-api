import { Day, PrismaClient } from "@prisma/client";
import {
  IAssignExerciseInput,
  ICreateWorkoutPlanInput,
  IUpdateExerciseInput,
  IUpdateWorkoutPlanInput,
} from "../controller/workout_plan_controller";
import { prisma } from "../lib/prisma";
import { err, ok } from "../utils/result";
const find_workout_schedule = async (id: string) => {
  try {
    const workout_sched = await prisma.workoutDay.findFirst({
      where: {
        id,
      },
      include: {
        exercises: true,
      },
    });

    return ok(workout_sched);
  } catch (error) {
    return err({ message: "Failed to find workout schedule" });
  }
};

const add_exercise_to_day = async (
  day_id: string,
  reps: number,
  sets: number,
  detail_id: string
) => {
  try {
    const exercise = await prisma.exercise.create({
      data: {
        workout_day_id: day_id,
        reps: reps,
        sets: sets,
        detail_id: detail_id,
      },
    });

    return ok(exercise);
  } catch (error) {
    return err({ message: "Failed to add exercise" });
  }
};

const remove_exercise_to_day = async (id: string) => {
  try {
    await prisma.exercise.delete({
      where: {
        id,
      },
    });

    return ok(null);
  } catch (error) {
    return err({ message: "Failed to remove exercise" });
  }
};

const update_exercise_to_day = async (data: IUpdateExerciseInput) => {
  const { exercise_id, ...detail } = data;
  try {
    const updated_exercise = await prisma.exercise.update({
      where: {
        id: data.exercise_id,
      },
      data: detail,
    });

    return ok(updated_exercise);
  } catch (error) {
    return err({ message: "Failed to update exercise" });
  }
};

const create_workout_plan_with_day = async (data: ICreateWorkoutPlanInput) => {
  const Days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  try {
    const result = await prisma.$transaction(async (tx) => {
      const plan = await tx.workoutPlan.create({
        data: {
          user_id: data.user_id,
          name: data.name,
        },
        select: {
          id: true,
          name: true,
          is_active: true,
        },
      });

      const workouts: any = [];

      for (const day of Days) {
        workouts.push(
          await tx.workoutDay.create({
            data: {
              day: day as Day,
              workout_plan_id: plan.id,
            },
            select: {
              id: true,
              day: true,
            },
          })
        );
      }

      return {
        workout_plan: {
          ...plan,
          workouts,
        },
      };
    });

    return ok(result);
  } catch (error) {
    return err({ message: "Failed to create workoutplan" });
  }
};

const delete_workout_plan = async (id: string) => {
  try {
    await prisma.workoutPlan.delete({
      where: {
        id,
      },
    });

    return ok(null);
  } catch (error) {
    return err({ message: "Failed to delete workoutplan" });
  }
};

const update_workout_plan = async (data: IUpdateWorkoutPlanInput) => {
  try {
    const { name, workout_plan_id } = data;
    const workout_plan = await prisma.workoutPlan.update({
      where: {
        id: workout_plan_id,
      },
      data: {
        name,
      },
    });

    return ok(workout_plan);
  } catch (error) {
    return err({ message: "Failed to update workoutplan" });
  }
};

const find_workout_plans = async (
  id: string,
  query: {
    page_size: number;
    page_number: number;
  }
) => {
  try {
    const workout_plans = await prisma.workoutPlan.findMany({
      take: query.page_size,
      skip: query.page_number * query.page_size,
      where: {
        user_id: id,
      },
      select: {
        id: true,
        name: true,
        is_active: true,
        workouts: {
          select: {
            id: true,
            day: true,
          },
        },
      },
      orderBy: [
        {
          created_at: "desc",
        },
      ],
    });

    return ok(workout_plans);
  } catch (error) {
    return err({ message: "Failed to find workoutplan" });
  }
};

const activate_workout_plan = async (new_wp_id: string, old_wp_id: string) => {
  try {
    await prisma.$transaction(async (prisma) => {
      if (old_wp_id) {
        await prisma.workoutPlan.update({
          where: {
            id: old_wp_id,
          },
          data: {
            is_active: false,
          },
        });
      }

      await prisma.workoutPlan.update({
        where: {
          id: new_wp_id,
        },
        data: {
          is_active: true,
        },
      });
    });

    return ok(null);
  } catch (error) {
    return err({ message: "Failed to activate workoutplan" });
  }
};
export default {
  find_workout_schedule,
  add_exercise_to_day,
  remove_exercise_to_day,
  update_exercise_to_day,
  create_workout_plan_with_day,
  delete_workout_plan,
  update_workout_plan,
  find_workout_plans,
  activate_workout_plan,
};
