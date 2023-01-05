import { render, fireEvent } from '@testing-library/react'
import { describe, vi, it, expect } from 'vitest'
import { PrintDialog } from '@/components/PrintDialog'

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

describe('PrintDialog', () => {
  it('opens the dialog and submits the form to print receipts for the selected farm', () => {
    window.open = vi.fn()
    const { getByText, getByRole } = render(
      <PrintDialog farms={farms}>
        <button>Open Now</button>
      </PrintDialog>,
    )

    const buttonToOpen = getByText(/open now/i)
    fireEvent.click(buttonToOpen)

    const form = getByRole('form')

    const printButton = form.querySelector('button') as HTMLButtonElement

    fireEvent.click(printButton)

    expect(window.open).toHaveBeenCalledWith('/api/receipts/print/by-farm/0')
  })
})
