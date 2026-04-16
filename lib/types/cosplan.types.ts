import { z } from 'zod';
import { Database } from '../supabase/database.types';

// =====================================================================
// Cosplan Status Manifest
// =====================================================================
export type CosplanStatus = Database['public']['Enums']['cosplan_status'];
export type CosplanAssetType = Database['public']['Enums']['cosplan_asset_type'];

// =====================================================================
// Cosplan DTOs (Data Transfer Objects)
// =====================================================================

export interface CosplanListItemDTO {
  id: string;
  characterName: string;
  series: string;
  status: CosplanStatus;
  deadline: string | null;
  budgetCeiling: number;
  progressPercentage: number;
  tasksCount: number;
  completedTasksCount: number;
  createdAt: string;
}

export interface CosplanTaskDTO {
  id: string;
  title: string;
  category: string;
  isCompleted: boolean;
  position: number;
}

export interface CosplanBudgetItemDTO {
  id: string;
  itemName: string;
  cost: number;
  status: string; // NEEDED, ORDERED, ARRIVED
}

export interface CosplanAssetDTO {
  id: string;
  url: string;
  publicId: string | null;
  assetType: CosplanAssetType;
}

export interface CosplanMeasurementDTO {
  id: string;
  label: string;
  value: string;
  unit: string;
}

export interface CosplanSwatchDTO {
  id: string;
  hexCode: string;
  label: string | null;
}

export interface CosplanDetailDTO {
  id: string;
  characterName: string;
  series: string;
  status: CosplanStatus;
  budgetCeiling: number;
  deadline: string | null;
  visibility: string;
  notes: any; // Lexical JSON
  tasks: CosplanTaskDTO[];
  budgetItems: CosplanBudgetItemDTO[];
  assets: CosplanAssetDTO[];
  measurements: CosplanMeasurementDTO[];
  swatches: CosplanSwatchDTO[];
  createdAt: string;
  updatedAt: string;
}

// =====================================================================
// Validation Schemas (Zod)
// =====================================================================

export const cosplanBaseSchema = z.object({
  characterName: z.string().min(1, 'Character name is required').max(100),
  series: z.string().min(1, 'Series is required').max(100),
  status: z.enum(['DREAMING', 'PLANNING', 'IN_PROGRESS', 'ALMOST_DONE', 'ASCENDED', 'STASIS']),
  budgetCeiling: z.number().min(0),
  deadline: z.string().nullable().optional(),
  visibility: z.enum(['PRIVATE', 'FRIENDS', 'PUBLIC']),
});

export const cosplanTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  category: z.string().default('GENERAL'),
  isCompleted: z.boolean().default(false),
});

export const cosplanBudgetItemSchema = z.object({
  itemName: z.string().min(1, 'Item name is required'),
  cost: z.number().min(0).default(0),
  status: z.string().default('NEEDED'),
});

export const cosplanMeasurementSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  unit: z.string().default('cm'),
});

export const cosplanSwatchSchema = z.object({
  hexCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex code'),
  label: z.string().optional(),
});

export type CreateCosplanInput = z.infer<typeof cosplanBaseSchema>;
export type UpdateCosplanInput = Partial<CreateCosplanInput> & { notes?: any };
