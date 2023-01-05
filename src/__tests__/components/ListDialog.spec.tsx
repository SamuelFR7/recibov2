import { ListDialog } from '@/components/ListDialog'
import { fireEvent, render } from '@testing-library/react'
import { describe, it, vi, expect } from 'vitest'

vi.mock('./Form/Select', () => ({
  Select: vi.fn(({ children }) => children),
}))

vi.mock('./Button', () => ({
  Button: vi.fn(({ children }) => children),
}))

const farms = [
  { id: '1', name: 'Farm 1' },
  { id: '2', name: 'Farm 2' },
  { id: '3', name: 'Farm 3' },
]

describe('ListDialog', () => {
  it('should opens the dialog and submits the form to print receipts for the selected farm', () => {
    window.open = vi.fn()
    const { getByText, getByRole } = render(
      <ListDialog farms={farms}>
        <button>Open Now</button>
      </ListDialog>,
    )

    const buttonToOpen = getByText(/open now/i)
    fireEvent.click(buttonToOpen)

    const form = getByRole('form')

    const printButton = form.querySelector('button') as HTMLButtonElement

    fireEvent.click(printButton)

    expect(window.open).toHaveBeenCalledWith(
      '/api/receipts/print/list/all-farms',
    )
  })
})
