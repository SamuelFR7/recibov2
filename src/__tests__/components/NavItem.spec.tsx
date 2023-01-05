import { NavItem } from '@/components/NavItem'
import { render } from '@testing-library/react'
import { useRouter } from 'next/router'
import { describe, it, Mock, vi, expect } from 'vitest'

vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}))

describe('NavItem', () => {
  it('should render the title and apply the correct styles for an active route', () => {
    ;(useRouter as Mock).mockReturnValue({ asPath: '/path' })

    const { getByText } = render(<NavItem href="/path" title="Title" />)

    const title = getByText('Title')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-text')
  })

  it('should render the title and apply the correct styles for an inactive route', () => {
    ;(useRouter as Mock).mockReturnValue({ asPath: '/notpath' })

    const { getByText } = render(<NavItem href="/path" title="Title2" />)

    const title = getByText('Title2')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-white')
  })
})
