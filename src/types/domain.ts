import type { GardenRow, PlantRow } from "@/types/database";

export interface Garden {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Plant {
  id: string;
  gardenId: string;
  commonName: string;
  botanicalName: string | null;
  cultivar: string | null;
  shortDescription: string | null;
  careBasics: string | null;
  habitatValue: string | null;
  personalNotes: string | null;
  qrCodeValue: string | null;
  primaryPhotoUri: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGardenInput {
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export interface UpdateGardenInput {
  name?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface CreatePlantInput {
  gardenId: string;
  commonName: string;
  botanicalName?: string | null;
  cultivar?: string | null;
  shortDescription?: string | null;
  careBasics?: string | null;
  habitatValue?: string | null;
  personalNotes?: string | null;
  qrCodeValue?: string | null;
  primaryPhotoUri?: string | null;
}

export function mapGardenRow(row: GardenRow): Garden {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapPlantRow(row: PlantRow): Plant {
  return {
    id: row.id,
    gardenId: row.garden_id,
    commonName: row.common_name,
    botanicalName: row.botanical_name,
    cultivar: row.cultivar,
    shortDescription: row.short_description,
    careBasics: row.care_basics,
    habitatValue: row.habitat_value,
    personalNotes: row.personal_notes,
    qrCodeValue: row.qr_code_value,
    primaryPhotoUri: row.primary_photo_uri,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
