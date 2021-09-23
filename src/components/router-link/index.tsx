import { useMemo, useCallback, ReactNode, MouseEvent } from 'react'
import { useRouter } from 'next/router'

export function RouterLink({ children, href, onClick, useLink, ...props }: Props) {
  // __STATE <React.Hooks>
  const router = useRouter()
  const defClassName: string = useMemo(() => `${props.className || ''} router-link`, [])
  const className: string = useMemo(() => {
    return [router.pathname, router.asPath].some((r) => r.startsWith(href))
      ? `${defClassName} ${props?.activeClass || 'router-link-active'}`
      : defClassName
  }, [router])

  // __FUNCTIONS
  const handleRouterLink = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    router.push(href)

    if (onClick) onClick()
  }, [])

  // __RENDER
  if (useLink) {
    return (
      <a className={defClassName.trim()} href={href} {...props}>
        {children}
      </a>
    )
  } else {
    return (
      <a className={className.trim()} href={href} {...props} onClick={handleRouterLink}>
        {children}
      </a>
    )
  }
}

export interface Props {
  children: ReactNode
  className?: string
  activeClass?: string
  useLink?: boolean
  onClick?: () => void

  /**
   * Specifies the URL of the page the link goes to
   */
  href: string

  /**
   * Specifies where to open the linked document
   */
  target?: '_blank' | '_parent' | '_self' | '_top'

  /**
   * Specifies the relationship between the current document and the linked document
   */
  rel?:
    | 'alternate'
    | 'author'
    | 'bookmark'
    | 'external'
    | 'help'
    | 'license'
    | 'next'
    | 'nofollow'
    | 'noreferrer'
    | 'noopener'
    | 'prev'
    | 'search'
    | 'tag'

  /**
   * Specifies which referrer information to send with the link
   */
  referrerpolicy?:
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url'
}

export default useRouter
