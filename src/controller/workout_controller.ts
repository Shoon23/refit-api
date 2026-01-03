import { Request, Response } from "express";
import fs from "fs";
import Joi from "joi";
import {
  paginate_results,
  remove_duplicates,
  shuffle_array,
} from "../utils/array_utils";
import { iExercises, iWorkout } from "../types/workout_types";
import {
  filter_by_equipments,
  filter_by_level,
  filter_by_muscle,
  filter_by_search_key,
} from "../utils/filter_utils";
import workout_service from "../services/workout_service";

export const level_types = ["beginner", "intermediate", "expert"];

export const muscle_groups = [
  "quadriceps",
  "shoulders",
  "abdominals",
  "chest",
  "hamstrings",
  "triceps",
  "biceps",
  "lats",
  "middle back",
  "calves",
  "lower back",
  "forearms",
  "glutes",
  "traps",
  "adductors",
  "abductors",
  "neck",
];

export const equipment_types = [
  "barbell",
  "dumbbell",
  "calisthenics",
  "cable",
  "machine",
  "kettlebells",
  "bands",
  "medicine ball",
  "exercise ball",
  "foam roll",
  "e-z curl bar",
];
export interface IRecommendWorkoutInput {
  levels: string[];
  equipments: string[];
  muscles: string[];
}

export interface IPaginationQuery {
  page_size?: number;
  page_number?: number;
  is_shuffle?: boolean;
}
const pagination_schema = Joi.object({
  page_size: Joi.number().integer().min(1).optional().default(10),
  page_number: Joi.number().integer().min(1).optional().default(1),
  is_shuffle: Joi.boolean().optional().default(true),
});

// reccomend_workout

const reccom_schema = Joi.object({
  levels: Joi.array()
    .items(Joi.string().valid(...level_types))
    .required(),
  equipments: Joi.array()
    .items(Joi.string().valid(...equipment_types))
    .required(),
  muscles: Joi.array()
    .items(Joi.string().valid(...muscle_groups))
    .required(),
});

async function reccomend_workout(req: Request, res: Response) {
  const { value, error } = reccom_schema.validate(req.body);

  const { value: query_string } = pagination_schema.validate(req.query);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const result = await workout_service.recommendWorkout(
    value as IRecommendWorkoutInput,
    query_string as IPaginationQuery
  );
  if (!result.ok)
    return res.status(500).json({ message: result.error.message });

  return res.status(200).json(result.value);
}

export interface ISearchWorkoutInput {
  levels?: string[];
  equipments?: string[];
  muscles?: string[];
  search_key?: string;
}
const search_schema = Joi.object({
  levels: Joi.array().items(Joi.string().valid(...level_types)),
  equipments: Joi.array().items(Joi.string().valid(...equipment_types)),
  muscles: Joi.array().items(Joi.string().valid(...muscle_groups)),
  search_key: Joi.string().allow(""),
});

// search workout
async function search_workouts(req: Request, res: Response) {
  const { value, error } = search_schema.validate(req.body);
  const { value: query_string } = pagination_schema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const result = await workout_service.find_workouts(
    value as IRecommendWorkoutInput,
    query_string as IPaginationQuery
  );

  if (!result.ok)
    return res.status(500).json({ message: result.error.message });

  return res.status(200).json(result.value);
}

export default {
  reccomend_workout,
  search_workouts,
};
