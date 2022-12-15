import { ReactNode } from 'react'

export function Page({ children }: { children: ReactNode }) {
  return <div className="h-[1122px] w-[210mm]">{children}</div>
}
