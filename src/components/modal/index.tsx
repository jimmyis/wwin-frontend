import { useCallback, ReactNode } from 'react'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import { scrollOff } from '@/utils'

export interface Props {
  active: boolean
  className?: string
  title?: string
  children: ReactNode
  onClose: (value: boolean) => void
}

export function ModalComponent({ active, className, children, onClose, ...props }: Props) {
  // __FUNCTIONS
  const handleClose = useCallback(() => {
    if (active) {
      onClose(false)
    }
  }, [active])

  // __RENDER
  return (
    <CSSTransition
      in={active}
      timeout={200}
      unmountOnExit={true}
      onEnter={() => scrollOff(true)}
      onExited={() => scrollOff(false)}
    >
      <div className='ui--modal'>
        <div className={classNames('ui--modal-container', className)}>
          <div className='ui--modal-border'></div>

          <div className='ui--modal-header'>
            <div className='title'>{props.title || 'Modal Title'}</div>

            <button type='button' className='btn btn-close' onClick={handleClose}>
              <span className='icon bi bi-x'></span>
            </button>
          </div>

          <div className='ui--modal-boby'>{children}</div>
        </div>
      </div>
    </CSSTransition>
  )
}
