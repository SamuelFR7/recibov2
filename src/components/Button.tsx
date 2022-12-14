import { cva, VariantProps } from 'class-variance-authority'
import { ButtonHTMLAttributes } from 'react'

const buttonClasses = cva('rounded-md font-semibold', {
  variants: {
    variant: {
      primary: 'bg-primary hover:bg-primaryHover text-white',
      warn: 'bg-warn hover:bg-warnHover text-white',
      info: 'bg-gray hover:bg-grayHover text-text',
    },
    size: {
      small: 'p-3',
      full: 'py-3 w-full',
    },
    font: {
      small: 'text-sm',
      medium: 'text-md',
    },
  },
  defaultVariants: {
    variant: 'primary',
    font: 'small',
  },
})

interface ButtonProps
  extends VariantProps<typeof buttonClasses>,
    ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({
  children,
  variant,
  size,
  font,
  ...rest
}: ButtonProps) {
  return (
    <button className={buttonClasses({ variant, size, font })} {...rest}>
      {children}
    </button>
  )
}
