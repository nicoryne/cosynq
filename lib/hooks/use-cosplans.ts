'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createCosplanAction, 
  updateCosplanAction 
} from '../actions/cosplan.actions';
import { createClient } from '../supabase/client';
import { CosplanService } from '../services/cosplan.service';
import { toast } from 'sonner';
import { CreateCosplanInput, UpdateCosplanInput } from '../types/cosplan.types';

// Query Keys
export const cosplanKeys = {
  all: ['cosplans'] as const,
  lists: () => [...cosplanKeys.all, 'list'] as const,
  list: (filters: string) => [...cosplanKeys.lists(), { filters }] as const,
  details: () => [...cosplanKeys.all, 'detail'] as const,
  detail: (id: string) => [...cosplanKeys.details(), id] as const,
};

/**
 * Hook: Retrieve the user's cosplan manifest
 */
export function useCosplans() {
  const supabase = createClient();
  const cosplanService = new CosplanService(supabase);

  return useQuery({
    queryKey: cosplanKeys.lists(),
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      return cosplanService.getCosplans(user.id);
    },
  });
}

/**
 * Hook: Retrieve a specific cosplan manifest detail
 */
export function useCosplanDetail(id: string) {
  const supabase = createClient();
  const cosplanService = new CosplanService(supabase);

  return useQuery({
    queryKey: cosplanKeys.detail(id),
    queryFn: () => cosplanService.getCosplanDetail(id),
    enabled: !!id,
  });
}

/**
 * Hook: Manifest a new cosplan
 */
export function useCreateCosplan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCosplanInput) => createCosplanAction(data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: cosplanKeys.lists() });
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error('Manifestation failed. Signal lost.');
    },
  });
}

/**
 * Hook: Recalibrate an existing cosplan
 */
export function useUpdateCosplan(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCosplanInput) => updateCosplanAction(id, data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: cosplanKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: cosplanKeys.lists() });
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error('Recalibration failed. Signal lost.');
    },
  });
}
