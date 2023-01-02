import { Button } from '@/components/Button'
import { Input } from '@/components/Form/Input'
import { getServerAuthSession } from '@/server/common/get-server-auth-session'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type LoginSchema = z.infer<typeof loginSchema>

export default function Login() {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const supabase = createBrowserSupabaseClient()

  const handleSignIn: SubmitHandler<LoginSchema> = async (values) => {
    await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    router.push('/')
  }
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[450px] bg-gray border border-border rounded-t-lg text-sm p-5">
        <span className="text-lg">Entrar</span>
        <form onSubmit={handleSubmit(handleSignIn)}>
          <Input {...register('email')} error={errors.email} label="Email" />
          <Input
            {...register('password')}
            error={errors.password}
            label="Senha"
          />
          <Button size="full" type="submit">
            Entrar
          </Button>
        </form>
      </div>
    </div>
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
