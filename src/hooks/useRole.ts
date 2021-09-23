import { useSelector, authSelector } from '@/store'
import { Role } from '@/types/constants'

export function useRole() {
  // __STATE <React.Hooks>
  const user = useSelector(authSelector.getUser)

  return {
    isOwner: user?.role === Role.Owner,
    isAdmin: user?.role === Role.Admon,
    isUser: user?.role === Role.User
  }
}
