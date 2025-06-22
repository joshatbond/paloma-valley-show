import 'react'

declare module 'react' {
  interface CSSProperties {
    '--fill-color'?: string
    '--fill-percentage'?: string
  }
}
