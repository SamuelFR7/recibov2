import { Button } from '@/components/Button'
import { Input } from '@/components/Form/Input'
import { Loader } from '@/components/assets/Loader'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect } from 'react'

const sendMail = z.object({
  email: z.string().email({ message: 'Digite um email válido' }),
})

type SendMailType = z.infer<typeof sendMail>

export default function SignIn() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SendMailType>({
    resolver: zodResolver(sendMail),
  })

  const supabase = createBrowserSupabaseClient()

  const handleSend: SubmitHandler<SendMailType> = async (values) => {
    await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/recovery/reset`,
    })
  }

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="w-[33.7rem] rounded-lg bg-white shadow-header">
        <div className="flex flex-col gap-3 px-5 py-4">
          <h1 className="text-2xl">Recibo</h1>

          <p className="text-sm text-gray-text">Enviar email de recuperação</p>
          <div className="flex flex-col gap-4">
            <div className="h-[1px] bg-gray" />
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit(handleSend)}
            >
              <Input
                {...register('email')}
                error={errors.email}
                label="Email"
                placeholder="johndoe@gmail.com"
                type="text"
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
                    <span>Enviar</span>
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
