import { Button } from '@/components/Button'
import { Input } from '@/components/Form/Input'
import { Loader } from '@/components/assets/Loader'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useUser } from '@supabase/auth-helpers-react'

const resetSchema = z
  .object({
    password: z.string().min(6),
    passwordConfirmation: z.string().min(6),
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        code: 'custom',
        message: 'As senhas devem ser iguais',
      })
    }
  })

type ResetSchemaType = z.infer<typeof resetSchema>

export default function SignIn() {
  const user = useUser()
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ResetSchemaType>({
    resolver: zodResolver(resetSchema),
  })

  const supabase = createBrowserSupabaseClient()

  const handleReset: SubmitHandler<ResetSchemaType> = async (values) => {
    await supabase.auth.updateUser({
      email: user?.email,
      password: values.password,
    })

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
              onSubmit={handleSubmit(handleReset)}
            >
              <Input
                {...register('password')}
                error={errors.password}
                label="Senha"
                placeholder="123456"
                type="password"
              />
              <Input
                {...register('passwordConfirmation')}
                error={errors.passwordConfirmation}
                label="Confirmar senha"
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
          </div>
        </div>
      </div>
    </div>
  )
}
