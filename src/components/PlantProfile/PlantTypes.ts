export type GetPlantList = {
  data: Array<{
    id: number,
    common_name: string | null,
    scientific_name: Array<string> | null,
    other_name: Array<string> | null,
    cycle: string | null,
    watering: string | null,
    sunlight: Array<string> | null,
    default_image: {
      image_id: number,
      license: number | null,
      license_name: string | null,
      license_url: string | null,
      original_url: string | null,
      regular_url: string | null,
      medium_url: string | null,
      small_url: string | null,
      thumbnail: string | null,
    } | null,
  }>
};

export type GetPlantDetails = {
  id: number,
  common_name: string | null,
  scientific_name: Array<string> | null,
  other_name: Array<string> | null,
  family: string | null,
  type: string | null,
  dimension: string | null,
  cycle: string | null,
  watering: string | null,
  attracts: Array<string> | null,
  propagation: Array<string> | null,
  flowers: boolean,
  flowering_season: string | null,
  color: string | null,
  sunlight: Array<string> | null,
  soil: Array<string> | null,
  leaf: boolean,
  leaf_color: Array<string> | null,
  poisonous_to_humans: boolean,
  poisonous_to_pets: boolean,
  drought_tolerant: boolean,
  invasive: boolean,
  rare: boolean,
  tropical: boolean,
  indoor: boolean,
  care_level: string | null,
  default_image: {
    image_id: number,
    license: number | null,
    license_name: string | null,
    license_url: string | null,
    original_url: string | null,
    regular_url: string | null,
    medium_url: string | null,
    small_url: string | null,
    thumbnail: string | null,
  } | null,
};