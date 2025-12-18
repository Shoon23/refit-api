// services/v1/preference.service.ts
import preference_repo from "../repository/preference_repo";
import {
  ICreatePreferenceInput,
  IUpdatePreferenceInput,
} from "../controller/preference_controller";
import { err, ok, Result } from "../utils/result";

const updatePreference = async (
  data: IUpdatePreferenceInput
): Promise<Result<null, { message: string }>> => {
  const { id, levels = [], equipments = [], muscles = [] } = data;

  const results = await Promise.all([
    levels.length > 0
      ? preference_repo.updatePreferenceLevels(id, levels)
      : ok(null),
    equipments.length > 0
      ? preference_repo.updatePreferenceEquipments(id, equipments)
      : ok(null),
    muscles.length > 0
      ? preference_repo.updatePreferenceMuscles(id, muscles)
      : ok(null),
  ]);

  // Check if any failed
  const failed = results.find((r) => !r.ok);

  if (failed)
    return err({
      message: "Something Went Wrong",
      status: 500,
    });

  return ok(null);
};
const createPreference = async (input: ICreatePreferenceInput) => {
  const createResult = await preference_repo.createPreference(input);
  if (!createResult.ok) return err({ message: createResult.error.message });

  const prefData = await preference_repo.getPreferenceById(createResult.value);
  if (!prefData.ok) return prefData;

  return ok({
    id: createResult.value,
    ...prefData.value,
  });
};
export default { updatePreference, createPreference };
