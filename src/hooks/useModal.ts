import { useMemo, useCallback, ReactNode } from 'react'
import { useSelector, useDispatch, coreSelector, coreActions } from '@/store'

export function useModal(component: ReactNode, title?: string) {
  // __STATE <React.Hooks>
  const dispatch = useDispatch()
  const modal = useSelector(coreSelector.getModals)
  const currentCommponent = useMemo(() => component, [])

  // __FUNCTIONS
  const handleOpen = useCallback((_component?: ReactNode) => {
    const action = coreActions.setModals({
      visible: true,
      title: title || 'modal title',
      component: _component || currentCommponent
    })

    dispatch(action)
  }, [])

  const handleClose = useCallback(() => {
    const action = coreActions.setModals({
      ...modal,
      visible: false
    })

    dispatch(action)
  }, [])

  return {
    onModalActive: handleOpen,
    onModalClose: handleClose
  }
}
