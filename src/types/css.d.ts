import 'react'

declare module 'react' {
  interface CSSProperties {
    '--mask-height'?: string
    '--duration'?: string
  }
}
