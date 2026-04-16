import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { UserService } from '@/lib/services/user.service';
import { useDebounce } from './use-debounce';

const supabase = createClient();
const userService = new UserService(supabase);

/**
 * Hook: Performs fuzzy user discovery with debouncing and caching
 * @param query - The search term to analyze
 */
export function useSearchUsers(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ['search-users', debouncedQuery],
    queryFn: async () => {
      // Don't transmit if query is too Short
      if (!debouncedQuery || debouncedQuery.length < 2) return [];
      return userService.searchProfiles(debouncedQuery);
    },
    // Only manifest if the signal is significant
    enabled: debouncedQuery.length >= 2,
    // Telemetry economy: cache results for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}
