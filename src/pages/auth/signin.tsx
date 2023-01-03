import { Button } from '@/components/Button'
import { Input } from '@/components/Form/Input'
import { Loader } from '@/components/assets/Loader'
import { getServerAuthSession } from '@/server/common/get-server-auth-session'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email({ message: 'Digite um email válido' }),
  password: z.string(),
})

type LoginSchema = z.infer<typeof loginSchema>

export default function SignIn() {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const supabase = createBrowserSupabaseClient()

  const handleSignIn: SubmitHandler<LoginSchema> = async (values) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      setError('email', {
        message: 'Usuário ou senha incorretos',
      })

      return setError('password', {
        message: 'Usuário ou senha incorretos',
      })
    }

    return router.push('/')
  }

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="w-[33.7rem] rounded-lg bg-white shadow-header">
        <div className="flex flex-col gap-3 px-5 py-4">
          <h1 className="text-2xl">Recibo</h1>

          <p className="text-sm text-gray-text">Entrar agora</p>
          <div className="flex flex-col gap-4">
            <div className="h-[1px] bg-gray" />
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(handleSignIn)}
            >
              <Input
                {...register('email')}
                error={errors.email}
                label="Email"
                placeholder="johndoe@mail.com"
              />
              <Input
                {...register('password')}
                error={errors.password}
                label="Senha"
                type="password"
                placeholder="123456"
              />
              <div className="mt-3 w-full">
                <Button
                  disabled={isSubmitting}
                  size="full"
                  font="medium"
                  fontWeight="medium"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader width="30" height="30" />
                    </div>
                  ) : (
                    <span>Entrar</span>
                  )}
                </Button>
              </div>
            </form>
            <a
              href="/auth/recovery/send-email"
              className="text-sm text-gray-text text-center hover:text-text"
            >
              Esqueceu a senha?
            </a>
          </div>
        </div>
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
