import * as AlertDialog from '@radix-ui/react-alert-dialog'
import * as Separator from '@radix-ui/react-separator'
import { ReactNode } from 'react'
import { Button } from './Button'

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
        <AlertDialog.Content className="bg-white rounded-md shadow-header fixed top-1/2 left-1/2 alert-transform max-w-[50rem] w-full p-6">
          <AlertDialog.Title className="m-0 text-md font-bold">
            Você tem certeza disso?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm">
            Essa ação não pode ser desfeita
          </AlertDialog.Description>
          <Separator.Root className="w-full h-[1px] bg-grayHover my-5" />
          <div className="flex gap-6 justify-end text-sm">
            <AlertDialog.Cancel>
              <Button variant="info" size="small" type="button">
                Cancelar
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                onClick={action}
                variant="warn"
                size="small"
                type="button"
              >
                Deletar
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
