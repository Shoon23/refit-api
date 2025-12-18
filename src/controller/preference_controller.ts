import Joi from "joi";
import {
  level_types,
  equipment_types,
  muscle_groups,
} from "./workout_controller";
import { Request, Response } from "express";
import preference_service from "../services/preference_service";
export interface IUpdatePreferenceInput {
  id: string;
  levels?: string[];
  equipments?: string[];
  muscles?: string[];
}
const update_preference_schema = Joi.object({
  levels: Joi.array().items(Joi.string().valid(...level_types)),
  equipments: Joi.array().items(Joi.string().valid(...equipment_types)),
  muscles: Joi.array().items(Joi.string().valid(...muscle_groups)),
  id: Joi.string().required(),
}).or("levels", "equipments", "muscles");

async function update_preference(req: Request, res: Response) {
  const { value, error } = update_preference_schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const data: IUpdatePreferenceInput = value;

  const result = await preference_service.updatePreference(data);

  if (!result.ok)
    return res.status(500).json({ message: result.error.message });

  return res.status(200).json({ message: "Preferences updated successfully" });
}

export interface ICreatePreferenceInput {
  id: string;
  levels: string[];
  equipments: string[];
  muscles: string[];
}
const pref_schema = Joi.object({
  levels: Joi.array()
    .items(Joi.string().valid(...level_types))
    .required(),
  equipments: Joi.array()
    .items(Joi.string().valid(...equipment_types))
    .required(),
  muscles: Joi.array()
    .items(Joi.string().valid(...muscle_groups))
    .required(),
  user_id: Joi.string().required(),
});
export const create_preference = async (req: Request, res: Response) => {
  const { value, error } = pref_schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const data: ICreatePreferenceInput = value;

  const result = await preference_service.createPreference(data);
  if (!result.ok)
    return res.status(500).json({ message: result.error.message });

  return res.status(201).json(result.value);
};

export default {
  update_preference,
  create_preference,
};
