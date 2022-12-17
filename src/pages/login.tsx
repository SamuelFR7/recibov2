import LoginBtn from '@/components/login-btn'
import { getServerAuthSession } from '@/server/common/get-server-auth-session'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

export default function Login() {
  return (
    <form>
      <LoginBtn />
    </form>
  )
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
