import { getAuthService } from 'safetybuild-shared'
import { useQuery } from '@tanstack/react-query'

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      try {
        const session = await getAuthService().getSession()
        return session
      } catch (error) {
        throw error
      }
    }
  })
}
