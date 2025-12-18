import { prisma } from "../lib/prisma";
import { err, ok } from "../utils/result";

const find_user_by_email = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        password: true,
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        preference: {
          select: {
            id: true,
            equipments: { select: { id: true, name: true } },
            levels: { select: { id: true, name: true } },
            muscles: { select: { id: true, name: true } },
          },
        },
      },
    });

    return ok(user);
  } catch (error) {
    return err({ message: "Something Went Wrong", status: 500 });
  }
};

const find_active_workout_plan_by_userId = async (userId: string) => {
  try {
    const plan = await prisma.workoutPlan.findFirst({
      where: { user_id: userId, is_active: true },
      select: {
        id: true,
        name: true,
        is_active: true,
        workouts: { select: { id: true, day: true } },
      },
    });

    return ok(plan);
  } catch (error) {
    return err({ message: "Something Went Wrong", status: 500 });
  }
};

const create_user = async (
  first_name: string,
  last_name: string,
  email: string,
  password: string
) => {
  try {
    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password,
      },
    });

    return ok(user);
  } catch (error) {
    return err({ message: "Something Went Wrong", status: 500 });
  }
};

const find_user_by_id = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        preference: {
          select: {
            id: true,
            equipments: {
              select: {
                id: true,
                name: true,
              },
            },
            levels: {
              select: {
                id: true,
                name: true,
              },
            },
            muscles: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return ok(user);
  } catch (error) {
    return err({ message: "Something Went Wrong", status: 500 });
  }
};
export default {
  find_user_by_email,
  find_active_workout_plan_by_userId,
  create_user,
  find_user_by_id,
};
