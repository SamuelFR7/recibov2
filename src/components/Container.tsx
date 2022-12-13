import { ReactNode } from 'react'
import classnames from 'classnames'

interface ContainerProps {
  children: ReactNode
  classNames?: string
}

export function Container({ children, classNames }: ContainerProps) {
  return (
    <div className={classnames('max-w-[140rem] mx-auto', classNames)}>
      {children}
    </div>
  )
}
