import { Header } from '@/components/Header'
import { fireEvent, render } from '@testing-library/react'
import { signOut } from 'next-auth/react'
import { vi, describe, it, expect } from 'vitest'

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(() => Promise.resolve()),
}))

vi.mock('next/router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

describe('Header component', () => {
  it('should out the user and redirects to the sign in page', async () => {
    const { getByText } = render(<Header />)

    const signOutButton = getByText(/sair/i)
    fireEvent.click(signOutButton)

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(signOut).toHaveBeenCalled()
  })
})
