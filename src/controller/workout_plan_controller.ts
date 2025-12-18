import { Request, Response } from "express";
import Joi from "joi";

import { Day } from "@prisma/client";
import workout_plan_service from "../services/workout_plan_service";

export interface IAssignExerciseInput {
  day: Day;
  workout_day_id: string;
  reps: number;
  set: number;
  detail_id: string;
}
const Days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const assign_exercise_schema = Joi.object({
  day: Joi.string()
    .valid(...Days)
    .required(),
  workout_day_id: Joi.string().required(),
  reps: Joi.number().positive().min(1).required(),
  sets: Joi.number().positive().min(1).required(),
  detail_id: Joi.string().required(),
});
async function assign_exercise(req: Request, res: Response) {
  const { value, error } = assign_exercise_schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const data: IAssignExerciseInput = value;

  const result = await workout_plan_service.assign_exercise(data);

  if (!result.ok)
    return res.status(500).json({ message: result.error.message });

  return res.status(200).json(result.value);
}

const get_exercise_schema = Joi.object({
  workout_day_id: Joi.string().required(),
});
async function get_exercise(req: Request, res: Response) {
  const { value, error } = get_exercise_schema.validate(req.params);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const result = await workout_plan_service.get_exercise(value.workout_day_id);

  if (!result.ok)
    return res.status(500).json({ message: result.error.message });

  return res.status(200).json(result.value);
}

const remove_exercise_schema = Joi.object({
  id: Joi.string().required(),
});
async function remove_exercise(req: Request, res: Response) {
  const { value, error } = remove_exercise_schema.validate(req.params);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const result = await workout_plan_service.remove_exercise(value.id);

  if (!result.ok)
    return res.status(500).json({ message: result.error.message });

  return res.status(200).json(result.value);
}

export interface IUpdateExerciseInput {
  exercise_id: string;
  sets?: number;
  reps?: number;
}

const update_exercise_schema = Joi.object({
  exercise_id: Joi.string().required(),
  sets: Joi.number().optional(),
  reps: Joi.number().optional(),
}).or("sets", "reps");
async function update_exercise(req: Request, res: Response) {
  const { value, error } = update_exercise_schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { exercise_id, ...detail } = value;

  const data: IUpdateExerciseInput = value;
  const result = await workout_plan_service.update_exercise(data);

  if (!result.ok)
    return res.status(500).json({ message: result.error.message });

  return res.status(200).json(result.value);
}

export interface ICreateWorkoutPlanInput {
  user_id: string;
  name: string;
}
// create  workout plan
const create_workout_plan_schema = Joi.object({
  user_id: Joi.string().required(),
  name: Joi.string().required(),
});
async function create_workout_plan(req: Request, res: Response) {
  const { value, error } = create_workout_plan_schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const data: ICreateWorkoutPlanInput = value;
  const result = await workout_plan_service.create_workout_plan(data);

  if (!result.ok)
    return res.status(500).json({ message: result.error.message });

  return res.status(200).json(result.value);
}

// delete workoutplan
const delete_workout_plan_schema = Joi.object({
  id: Joi.string().required(),
});
async function delete_workout_plan(req: Request, res: Response) {
  const { value, error } = delete_workout_plan_schema.validate(req.params);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const result = await workout_plan_service.delete_workout_plan(value.id);

  if (!result.ok)
    return res.status(500).json({ message: result.error.message });

  return res.status(200).json(result.value);
}

export interface IUpdateWorkoutPlanInput {
  workout_plan_id: string;
  name: string;
}
// update workoutplan
const update_workout_plan_schema = Joi.object({
  workout_plan_id: Joi.string().required(),
  name: Joi.string().required(),
});
async function update_workout_plan(req: Request, res: Response) {
  const { value, error } = update_workout_plan_schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const result = await workout_plan_service.update_workout_plan(value);

  if (!result.ok)
    return res.status(500).json({ message: result.error.message });

  return res.status(200).json(result.value);
}

// get workoutplan
const get_workout_plans_schema = Joi.object({
  id: Joi.string().required(),
});
const pagination_schema = Joi.object({
  page_size: Joi.number().integer().min(1).optional().default(10),
  page_number: Joi.number().integer().min(0).optional().default(0),
});

async function get_workout_plans(req: Request, res: Response) {
  // Validate params
  const { value: paramsValue, error: paramsError } =
    get_workout_plans_schema.validate(req.params);
  if (paramsError) {
    return res.status(400).json({ message: paramsError.details[0].message });
  }

  const { value: queryValue, error: queryError } = pagination_schema.validate(
    req.query
  );
  if (queryError) {
    return res.status(400).json({ message: queryError.details[0].message });
  }

  const result = await workout_plan_service.get_workout_plans(
    paramsValue.id,
    queryValue
  );

  if (!result.ok)
    return res.status(500).json({ message: result.error.message });

  return res.status(200).json(result.value);
}

// activate workoutplan
const active_workout_plan_schema = Joi.object({
  new_wp_id: Joi.string().required(),
  old_wp_id: Joi.string().allow(""),
});
async function active_workout_plan(req: Request, res: Response) {
  const { value, error } = active_workout_plan_schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const result = await workout_plan_service.active_workout_plan(
    value.new_wp_id,
    value.old_wp_id
  );

  if (!result.ok)
    return res.status(500).json({ message: result.error.message });

  return res.status(200).json(result.value);
}

export default {
  assign_exercise,
  get_exercise,
  remove_exercise,
  update_exercise,
  create_workout_plan,
  update_workout_plan,
  delete_workout_plan,
  get_workout_plans,
  active_workout_plan,
};
