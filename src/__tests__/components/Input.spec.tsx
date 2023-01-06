import { Input } from '@/components/Form/Input'
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('Input', () => {
  it('should renders the label and input correctly', () => {
    const { getByText } = render(<Input label="Name" name="name" />)
    expect(getByText('Name')).toBeInTheDocument()
  })

  it('should sets the input value when value prop is provided', () => {
    const { getByTestId } = render(
      <Input data-testid="johninput" label="Name" name="name" value="John" />,
    )
    expect(getByTestId('johninput')).toHaveValue('John')
  })

  it('should sets the input type when type prop is provided', () => {
    const { getByTestId } = render(
      <Input
        data-testid="passwordinput"
        label="Password"
        name="password"
        type="password"
      />,
    )

    expect(getByTestId('passwordinput')).toHaveAttribute('type', 'password')
  })

  it('should displays an error message when the error prop is provided', () => {
    const error = { message: 'This field is required', type: 'required' }
    const { getByText } = render(
      <Input label="name" name="name" error={error} />,
    )

    expect(getByText('This field is required')).toBeInTheDocument()
  })
})
