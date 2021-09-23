import { useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useSelector, useDispatch, coreSelector, coreActions } from '@/store'
import { scrollOff } from '@/utils'

export function ModalComponent() {
  // __STATE <React.Hooks>
  const dispatch = useDispatch()
  const state = useSelector(coreSelector.getModals)

  // __FUNCTIONS
  const handleClose = useCallback(() => {
    const action = coreActions.setModals({
      visible: false,
      title: state.title,
      component: state.component
    })

    dispatch(action)
  }, [state])

  const handleOnExited = useCallback(() => {
    const action = coreActions.setModals({
      visible: false,
      title: '',
      component: null
    })

    dispatch(action)
    scrollOff(false)
  }, [])

  // __RENDER
  return (
    <CSSTransition
      in={state.visible}
      timeout={400}
      unmountOnExit={true}
      onEnter={() => scrollOff(true)}
      onExited={handleOnExited}
    >
      <div className='ui--modal'>
        <div className='ui--modal-container'>
          <div className='ui--modal-border'></div>

          <div className='ui--modal-header'>
            <div className='title'>{state.title || 'Modal Title'}</div>

            <button type='button' className='btn btn-close' onClick={handleClose}>
              <span className='icon bi bi-x'></span>
            </button>
          </div>

          <div className='ui--modal-boby'>{state.component}</div>
        </div>
      </div>
    </CSSTransition>
  )
}
