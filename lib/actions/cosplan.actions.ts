'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { CosplanService } from '../services/cosplan.service';
import { 
  cosplanBaseSchema, 
  CreateCosplanInput, 
  UpdateCosplanInput,
  CosplanListItemDTO,
  CosplanDetailDTO
} from '../types/cosplan.types';
import { ActionResponse } from '../types/auth.types';

/**
 * Action: Create a new cosplan manifest
 */
export async function createCosplanAction(
  data: CreateCosplanInput
): Promise<ActionResponse<string>> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Verify session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, message: 'You must be signed in to manifest a cosplan.' };
    }

    // 2. Validate input
    const validation = cosplanBaseSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.error.flatten().fieldErrors as any,
      };
    }

    // 3. Execute via Service
    const cosplanService = new CosplanService(supabase);
    const id = await cosplanService.createCosplan(user.id, validation.data);

    revalidatePath('/hub/cosplans');
    return {
      success: true,
      message: 'Cosplan manifested successfully.',
      data: id,
    };
  } catch (error) {
    console.error('Create cosplan action error:', error);
    return { success: false, message: 'Failed to manifest cosplan.' };
  }
}

/**
 * Action: Update an existing cosplan
 */
export async function updateCosplanAction(
  id: string,
  data: UpdateCosplanInput
): Promise<ActionResponse> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Verify session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, message: 'Unauthorized access.' };
    }

    // 2. Execute via Service
    const cosplanService = new CosplanService(supabase);
    await cosplanService.updateCosplan(id, data);

    revalidatePath(`/hub/cosplans/${id}`);
    revalidatePath('/hub/cosplans');
    
    return {
      success: true,
      message: 'Cosplan recalibrated successfully.',
    };
  } catch (error) {
    console.error('Update cosplan action error:', error);
    return { success: false, message: 'Failed to recalibrate cosplan.' };
  }
}
