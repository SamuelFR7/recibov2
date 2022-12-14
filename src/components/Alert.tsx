import * as AlertDialog from '@radix-ui/react-alert-dialog'
import * as Separator from '@radix-ui/react-separator'
import { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
  action: () => void
}

export function Alert({ children, action }: AlertProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-modalBg fixed inset-0" />
        <AlertDialog.Content className="bg-white rounded-md shadow-header fixed top-1/2 left-1/2 AlertTransform max-w-[50rem] w-full p-6">
          <AlertDialog.Title className="m-0 text-md font-bold">
            Você tem certeza disso?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm">
            Essa ação não pode ser desfeita
          </AlertDialog.Description>
          <Separator.Root className="w-full h-[1px] bg-grayHover my-5" />
          <div className="flex gap-6 justify-end text-sm">
            <AlertDialog.Cancel>
              <button
                className="bg-gray hover:bg-grayHover p-3 rounded-md text-text text-md font-semibold"
                type="button"
              >
                Cancelar
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={action}
                className="bg-warn hover:bg-warnHover p-3 rounded-md text-white text-md font-semibold"
                type="button"
              >
                Deletar
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
