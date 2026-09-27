import type { CSSProperties } from 'react'

// permite pasar variables CSS personalizadas (--i, etc.) en el atributo style
export type CSSVars = CSSProperties & Record<`--${string}`, string | number>
