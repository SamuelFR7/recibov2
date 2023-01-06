import { Select } from '@/components/Form/Select'
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('Select', () => {
  it('should renders the label and select correctly', () => {
    const { getByText } = render(<Select label="Size" name="size" />)
    expect(getByText('Size')).toBeInTheDocument()
  })

  it('should sets the select the select value when value prop is provided', () => {
    const { getByTestId } = render(
      <Select data-testid="largeselect" label="Size" name="size" value="large">
        <option value="large">Large</option>
      </Select>,
    )

    expect(getByTestId('largeselect')).toHaveValue('large')
  })

  it('should render the options correctly', () => {
    const { getByText } = render(
      <Select label="Country" name="size">
        <option value="fr">France</option>
        <option value="en">England</option>
      </Select>,
    )

    expect(getByText(/france/i)).toBeInTheDocument()
  })

  it('should displays an error message when the error prop is provided', () => {
    const error = { message: 'This field is required', type: 'required' }
    const { getByText } = render(
      <Select label="name" name="name" error={error} />,
    )

    expect(getByText('This field is required')).toBeInTheDocument()
  })
})
