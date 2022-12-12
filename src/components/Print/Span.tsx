import { ReactNode } from 'react'

export function Span({ children }: { children: ReactNode }) {
  return (
    <span className="p-1 border border-black font-medium text-left w-full text-md">
      {children}
    </span>
  )
}
