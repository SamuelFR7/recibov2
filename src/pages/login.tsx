import { getServerAuthSession } from '@/server/common/get-server-auth-session'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { signIn } from 'next-auth/react'
import { useEffect } from 'react'

export default function Login() {
  useEffect(() => {
    signIn('auth0')
  }, [])

  return <div></div>
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const session = await getServerAuthSession(ctx)

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
