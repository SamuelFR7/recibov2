import {
  forwardRef,
  ForwardRefRenderFunction,
  SelectHTMLAttributes,
} from 'react'
import classnames from 'classnames'
import { FieldError } from 'react-hook-form'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: FieldError
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = (
  { label, className, children, error, ...rest },
  ref,
) => {
  return (
    <div className={classnames('flex flex-col', className)}>
      <label className="mb-1">{label}</label>
      <select
        className="bg-white px-3 py-2 border border-border rounded-md"
        {...rest}
      >
        {children}
      </select>
      <p>{error?.message}</p>
    </div>
  )
}

export const Select = forwardRef(SelectBase)
