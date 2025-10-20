import { useEffect } from 'react'

export default function useClickOutside(ref, onOutside) {
  useEffect(() => {
    function handle(event) {
      if (!ref?.current) return
      if (ref.current.contains(event.target)) return
      onOutside?.(event)
    }
    document.addEventListener('mousedown', handle)
    document.addEventListener('touchstart', handle)
    return () => {
      document.removeEventListener('mousedown', handle)
      document.removeEventListener('touchstart', handle)
    }
  }, [ref, onOutside])
}

