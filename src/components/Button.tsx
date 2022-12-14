import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ children, ...rest }: ButtonProps) {
  return (
    <button
      className="bg-primary hover:bg-primaryHover w-full py-3 rounded-md text-white text-md font-semibold"
      {...rest}
    >
      {children}
    </button>
  )
}
