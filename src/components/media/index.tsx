import { useState, useRef, useEffect, useCallback } from 'react'
import { getMediaBlob, Preview as IMedia, addEventListener, removeEventListener } from '@/utils'

export const defMedia: IMedia = {
  url: '',
  isImage: true,
  isVideo: false,
  isAudio: false
}

export interface Props {
  media: string | Blob | File
  autoPlay?: boolean
}

export function MediaComponent({ media, autoPlay }: Props) {
  // __STATE <React.Hooks>
  const [state, setState] = useState(defMedia)
  const elm = useRef<HTMLDivElement>(null)

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    async function run(): Promise<void> {
      const blob = await getMediaBlob(media)
      setState(blob)
      aspectRatioFit()
    }

    if (media) run()
  }, [media])

  useEffect(() => {
    addEventListener('resize', aspectRatioFit)
    return () => removeEventListener('resize', aspectRatioFit)
  }, [])

  // __FUNCTIONS
  const aspectRatioFit = useCallback(() => {
    if (!elm.current) return void 0
    const { clientWidth } = elm.current

    const result = (clientWidth * 4) / 3.5

    elm.current.style.height = `${result}px`
  }, [elm])

  // __RENDER
  return (
    <div className='ui--media' ref={elm}>
      {state.isImage && <img className='media image' src={state.url} />}
      {state.isVideo && (
        <video
          loop
          muted
          controls
          playsInline
          autoPlay={autoPlay}
          className='media video'
          controlsList='nodownload'
          src={state.url}
        />
      )}
      {state.isAudio && <audio loop controls className='media audio' src={state.url} />}
    </div>
  )
}
