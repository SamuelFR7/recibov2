import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface NavItemProps {
  href: string
  title: string
}

export function NavItem({ href, title }: NavItemProps) {
  const router = useRouter()

  const isActive = router.asPath === href

  return (
    <Link href={href}>
      <span
        className={classNames(
          'text-sm font-semibold hover:text-text',
          isActive ? 'text-text' : 'text-white',
        )}
      >
        {title}
      </span>
    </Link>
  )
}
