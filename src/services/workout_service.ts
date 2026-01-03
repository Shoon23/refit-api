import {
  IPaginationQuery,
  IRecommendWorkoutInput,
  ISearchWorkoutInput,
} from "../controller/workout_controller";
import workout_repo from "../repository/workout_repo";
import {
  paginate_results,
  remove_duplicates,
  shuffle_array,
} from "../utils/array_utils";
import {
  filter_by_equipments,
  filter_by_level,
  filter_by_muscle,
  filter_by_search_key,
} from "../utils/filter_utils";
import { ok, Result } from "../utils/result";
import { iWorkout } from "../types/workout_types";

const recommendWorkout = async (
  input: IRecommendWorkoutInput,
  query: IPaginationQuery
): Promise<Result<any, { message: string }>> => {
  const dataResult = await workout_repo.readExercisesFile();
  if (!dataResult.ok) return dataResult;

  const workouts = dataResult.value;

  const levelFiltered = filter_by_level(workouts, input.levels);
  const muscleFiltered = filter_by_muscle(levelFiltered, input.muscles);
  const equipmentFiltered = filter_by_equipments(
    muscleFiltered,
    input.equipments
  );

  const finalList = query.is_shuffle
    ? shuffle_array(equipmentFiltered)
    : equipmentFiltered;
  const paginated = paginate_results(finalList, {
    page_number: query.page_number ?? 1,
    page_size: query.page_size ?? 10,
  });
  return ok(paginated);
};

const find_workouts = async (
  data: ISearchWorkoutInput,
  query: IPaginationQuery
): Promise<Result<any, { message: string }>> => {
  const dataResult = await workout_repo.readExercisesFile();
  if (!dataResult.ok) return dataResult;
  let workouts = dataResult.value;

  const { equipments, levels, muscles, search_key } = data;

  const query_string = {
    page_size: query.page_size ?? 1,
    page_number: query.page_number ?? 10,
  };

  if (
    (!equipments || equipments.length === 0) &&
    (!muscles || muscles.length === 0) &&
    !search_key
  ) {
    const paginated_results = paginate_results(workouts, query_string);

    return ok(paginated_results);
  }

  // filter based on the equipments if its
  let equipment_search: iWorkout[] = [];
  if (equipments && equipments.length > 0) {
    equipment_search = filter_by_equipments(workouts, equipments);
  }

  // filter based on the muscles if its

  let muscle_search: iWorkout[] = [];
  if (muscles && muscles.length > 0) {
    muscle_search = filter_by_muscle(workouts, muscles);
  }

  let search_key_equipment: any = [];
  let search_key_muscle: any = [];
  let search_key_result: any = [];
  if (search_key) {
    // filter based on equipment and search key
    if (equipment_search.length > 0) {
      search_key_equipment = filter_by_search_key(equipment_search, search_key);
    }
    // filter based on muscles and search key

    if (muscle_search.length > 0) {
      search_key_muscle = filter_by_search_key(muscle_search, search_key);
    }
    // search key only

    if (equipment_search.length <= 0 && muscle_search.length <= 0) {
      search_key_result = filter_by_search_key(workouts, search_key);
    }
  }
  let clean_results: iWorkout[] = [];

  // both muscle and equipment or  search key and muscle ,and equipment and search key
  if (
    (search_key_equipment.length > 0 && search_key_muscle.length > 0) ||
    (equipment_search.length > 0 && muscle_search.length > 0)
  ) {
    const to_clean_equipment =
      search_key_equipment.length > 0 ? search_key_equipment : equipment_search;
    const to_clean_muscle =
      search_key_muscle > 0 ? search_key_muscle : muscle_search;

    clean_results = remove_duplicates(
      to_clean_equipment,
      to_clean_muscle,
      "id"
    );
  }

  let final_filter: iWorkout[] = [];

  // all filter options applied or only both equipmet and muscle
  if (clean_results.length > 0) {
    final_filter = clean_results;
  }
  // equipment filter only
  else if (
    equipment_search.length > 0 &&
    muscle_search.length <= 0 &&
    !search_key
  ) {
    final_filter = equipment_search;
  }
  // muscle filter only
  else if (
    muscle_search.length > 0 &&
    equipment_search.length <= 0 &&
    !search_key
  ) {
    final_filter = muscle_search;
  }
  // search key only
  else if (
    search_key &&
    equipment_search.length <= 0 &&
    muscle_search.length <= 0
  ) {
    final_filter = search_key_result;
  }
  // muscle and search key
  else if (
    muscle_search.length > 0 &&
    search_key &&
    equipment_search.length <= 0
  ) {
    final_filter = search_key_muscle;
  }
  // equipment and search key
  else if (
    equipment_search.length > 0 &&
    search_key &&
    muscle_search.length <= 0
  ) {
    final_filter = search_key_equipment;
  }

  const paginated_results = paginate_results(final_filter, query_string);
  return ok(paginated_results);
};
export default {
  recommendWorkout,
  find_workouts,
};
