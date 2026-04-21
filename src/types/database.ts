export interface GardenRow {
  id: string;
  name: string;
  description: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface PlantRow {
  id: string;
  garden_id: string;
  common_name: string;
  botanical_name: string | null;
  cultivar: string | null;
  location_name: string | null;
  date_planted: string | null;
  short_description: string | null;
  recognition_notes: string | null;
  care_basics: string | null;
  habitat_value: string | null;
  personal_notes: string | null;
  qr_code_value: string | null;
  primary_photo_uri: string | null;
  created_at: string;
  updated_at: string;
}
