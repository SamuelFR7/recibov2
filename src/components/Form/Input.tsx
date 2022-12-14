import {
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
} from 'react'
import classnames from 'classnames'
import { FieldError } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
  name: string
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { label, error, name, className, ...rest },
  ref,
) => {
  return (
    <div className={classnames('flex flex-col', className)}>
      <label className="mb-1">{label}</label>
      <input
        name={name}
        ref={ref}
        className={classnames(
          'px-3 py-2 border border-border rounded-md',
          'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
          error
            ? 'border-warn text-warn focus:border-warn focus:ring-warn'
            : '',
        )}
        {...rest}
      />
      <p className="mt-1 px-2 text-warn">{error?.message}</p>
    </div>
  )
}

export const Input = forwardRef(InputBase)
