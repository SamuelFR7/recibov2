import { Pagination } from '@/components/Pagination'
import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

describe('Pagination', () => {
  it('should render the correct number of pages and allow navigating through them', () => {
    const onPageChange = vi.fn()
    const totalCountOfRegisters = 50
    const registersPerPage = 10

    const { getByText } = render(
      <Pagination
        onPageChange={onPageChange}
        totalCountOfRegisters={totalCountOfRegisters}
        registersPerPage={registersPerPage}
      />,
    )

    const pages = ['2', '...', '5']
    pages.forEach((page) => expect(getByText(page)).toBeInTheDocument())

    const page2Button = getByText('2')
    fireEvent.click(page2Button)
    expect(onPageChange).toBeCalledWith(2)
  })
})
