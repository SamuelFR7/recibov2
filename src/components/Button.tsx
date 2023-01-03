import { cva, VariantProps } from 'class-variance-authority'
import { ButtonHTMLAttributes } from 'react'

const buttonClasses = cva('rounded-md disabled:cursor-not-allowed', {
  variants: {
    variant: {
      primary: 'bg-primary hover:bg-primaryHover text-white',
      warn: 'bg-warn hover:bg-warnHover text-white',
      info: 'bg-gray hover:bg-grayHover text-text',
    },
    size: {
      small: 'p-3',
      medium: 'py-3 px-5',
      full: 'py-3 w-full',
    },
    font: {
      small: 'text-sm',
      medium: 'text-md',
    },
    fontWeight: {
      regular: 'font-normal',
      medium: 'font-medium',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    variant: 'primary',
    font: 'medium',
    fontWeight: 'medium',
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
