import { ReactNode } from 'react'

export function InfoTitle({ children }: { children: ReactNode }) {
  return (
    <span className="pt-4 font-medium border-b border-black">{children}</span>
  )
}
