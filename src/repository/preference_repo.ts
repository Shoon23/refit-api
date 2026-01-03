import { ICreatePreferenceInput } from "../controller/preference_controller";
import { prisma } from "../lib/prisma";
import { ok, err, Result } from "../utils/result";
const updatePreferenceLevels = async (
  preferenceId: string,
  levels: string[]
): Promise<Result<null, { message: string }>> => {
  try {
    await prisma.preferLevel.deleteMany({
      where: { preference_id: preferenceId },
    });
    if (levels.length > 0) {
      await prisma.preferLevel.createMany({
        data: levels.map((lv) => ({ name: lv, preference_id: preferenceId })),
      });
    }
    return ok(null);
  } catch (error) {
    return err({ message: "Failed to update levels" });
  }
};

const updatePreferenceEquipments = async (
  preferenceId: string,
  equipments: string[]
): Promise<Result<null, { message: string }>> => {
  try {
    await prisma.preferEquipment.deleteMany({
      where: { preference_id: preferenceId },
    });
    if (equipments.length > 0) {
      await prisma.preferEquipment.createMany({
        data: equipments.map((eq) => ({
          name: eq,
          preference_id: preferenceId,
        })),
      });
    }
    return ok(null);
  } catch (error) {
    return err({ message: "Failed to update equipments" });
  }
};

const updatePreferenceMuscles = async (
  preferenceId: string,
  muscles: string[]
): Promise<Result<null, { message: string }>> => {
  try {
    await prisma.preferMuscle.deleteMany({
      where: { preference_id: preferenceId },
    });
    if (muscles.length > 0) {
      await prisma.preferMuscle.createMany({
        data: muscles.map((m) => ({ name: m, preference_id: preferenceId })),
      });
    }
    return ok(null);
  } catch (error) {
    return err({ message: "Failed to update muscles" });
  }
};
const createPreference = async (
  input: ICreatePreferenceInput
): Promise<Result<string, { message: string }>> => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const create_pref = await tx.preference.create({
        data: { user_id: input.user_id },
      });

      await tx.preferLevel.createMany({
        data: input.levels.map((level) => ({
          name: level,
          preference_id: create_pref.id,
        })),
      });

      await tx.preferMuscle.createMany({
        data: input.muscles.map((muscle) => ({
          name: muscle,
          preference_id: create_pref.id,
        })),
      });

      await tx.preferEquipment.createMany({
        data: input.equipments.map((equip) => ({
          name: equip,
          preference_id: create_pref.id,
        })),
      });

      return create_pref.id;
    });

    return ok(result);
  } catch (error) {
    return err({ message: "Failed to create preference" });
  }
};

const getPreferenceById = async (
  id: string
): Promise<
  Result<
    { levels: string[]; equipments: string[]; muscles: string[] },
    { message: string }
  >
> => {
  try {
    const levels = await prisma.preferLevel.findMany({
      where: { preference_id: id },
      select: { name: true },
    });

    const equipments = await prisma.preferEquipment.findMany({
      where: { preference_id: id },
      select: { name: true },
    });

    const muscles = await prisma.preferMuscle.findMany({
      where: { preference_id: id },
      select: { name: true },
    });

    return ok({
      levels: levels.map((lvl) => lvl.name),
      equipments: equipments.map((eq) => eq.name),
      muscles: muscles.map((m) => m.name),
    });
  } catch (error) {
    return err({ message: "Failed to fetch preference" });
  }
};
export default {
  updatePreferenceLevels,
  updatePreferenceEquipments,
  updatePreferenceMuscles,
  createPreference,
  getPreferenceById,
};
