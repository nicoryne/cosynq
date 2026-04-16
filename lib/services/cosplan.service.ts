// =====================================================================
// Cosplan Service Layer
// =====================================================================
// Core business logic for cosplay project manifestations
// Requirements: 5.x Series - Project Management
// =====================================================================

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/database.types';
import { 
  CosplanListItemDTO, 
  CosplanDetailDTO, 
  CreateCosplanInput, 
  UpdateCosplanInput,
  CosplanStatus,
  CosplanAssetType
} from '../types/cosplan.types';
import { toLocalTime } from '../utils/time.utils';

export class CosplanService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Fetches the user's cosplan manifest (paginated)
   * @param userId - Owner UUID
   * @param limit - Pagination limit
   * @returns List of Cosplan items
   */
  async getCosplans(userId: string, limit: number = 20): Promise<CosplanListItemDTO[]> {
    const { data, error } = await this.supabase
      .from('cosplans')
      .select(`
        *,
        cosplan_tasks(is_completed)
      `)
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map(item => {
      const tasks = item.cosplan_tasks || [];
      const tasksCount = tasks.length;
      const completedTasksCount = tasks.filter(t => t.is_completed).length;
      const progressPercentage = tasksCount > 0 
        ? Math.round((completedTasksCount / tasksCount) * 100) 
        : 0;

      return {
        id: item.id,
        characterName: item.character_name,
        series: item.series,
        status: item.status as CosplanStatus,
        deadline: item.deadline ? toLocalTime(item.deadline) : null,
        budgetCeiling: Number(item.budget_ceiling),
        progressPercentage,
        tasksCount,
        completedTasksCount,
        createdAt: item.created_at ? toLocalTime(item.created_at) : ''
      };
    });
  }

  /**
   * Aggregates a complete project manifest (Detail View)
   * @param id - Cosplan UUID
   * @returns Detailed Cosplan manifest
   */
  async getCosplanDetail(id: string): Promise<CosplanDetailDTO | null> {
    const { data: item, error } = await this.supabase
      .from('cosplans')
      .select(`
        *,
        cosplan_tasks(*),
        cosplan_budget_items(*),
        cosplan_assets(*),
        cosplan_measurements(*),
        cosplan_swatches(*)
      `)
      .eq('id', id)
      .single();

    if (error || !item) return null;

    return {
      id: item.id,
      characterName: item.character_name,
      series: item.series,
      status: item.status as CosplanStatus,
      budgetCeiling: Number(item.budget_ceiling),
      deadline: item.deadline ? toLocalTime(item.deadline) : null,
      visibility: item.visibility || 'PRIVATE',
      notes: item.notes,
      tasks: (item.cosplan_tasks || []).map(t => ({
        id: t.id,
        title: t.title,
        category: t.category || 'GENERAL',
        isCompleted: t.is_completed || false,
        position: t.position || 0
      })).sort((a, b) => a.position - b.position),
      budgetItems: (item.cosplan_budget_items || []).map(b => ({
        id: b.id,
        itemName: b.item_name,
        cost: Number(b.cost),
        status: b.status || 'NEEDED'
      })),
      assets: (item.cosplan_assets || []).map(a => ({
        id: a.id,
        url: a.url,
        publicId: a.public_id,
        assetType: a.asset_type as CosplanAssetType
      })),
      measurements: (item.cosplan_measurements || []).map(m => ({
        id: m.id,
        label: m.label,
        value: m.value,
        unit: m.unit || 'cm'
      })),
      swatches: (item.cosplan_swatches || []).map(s => ({
        id: s.id,
        hexCode: s.hex_code,
        label: s.label
      })),
      createdAt: item.created_at ? toLocalTime(item.created_at) : '',
      updatedAt: item.updated_at ? toLocalTime(item.updated_at) : ''
    };
  }

  /**
   * Manifests a new cosplan in the sanctuary
   */
  async createCosplan(userId: string, input: CreateCosplanInput): Promise<string> {
    const { data, error } = await this.supabase
      .from('cosplans')
      .insert({
        owner_id: userId,
        character_name: input.characterName,
        series: input.series,
        status: input.status,
        budget_ceiling: input.budgetCeiling,
        deadline: input.deadline,
        visibility: input.visibility
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  /**
   * Recalibrates a cosplan manifestation
   */
  async updateCosplan(id: string, input: UpdateCosplanInput): Promise<void> {
    const { error } = await this.supabase
      .from('cosplans')
      .update({
        character_name: input.characterName,
        series: input.series,
        status: input.status,
        budget_ceiling: input.budgetCeiling,
        deadline: input.deadline,
        visibility: input.visibility,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  }
}
