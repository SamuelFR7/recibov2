import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'phosphor-react'
import { FormEvent, ReactNode, useState } from 'react'
import { Button } from './Button'
import { Select } from './Form/Select'

interface ListDialogProps {
  farms: {
    id: string
    name: string
  }[]
  children: ReactNode
}

export function ListDialog({ children, farms }: ListDialogProps) {
  const [farmToPrint, setFarmToPrint] = useState<string | number>(0)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (farmToPrint === 0) {
      window.open('/api/receipts/print/list/all-farms')
      return setFarmToPrint(0)
    }

    window.open(`/api/receipts/print/list/by-farm?id=${farmToPrint}`)
    return setFarmToPrint(0)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-modalBg fixed inset-0" />
        <Dialog.Content className="bg-white rounded-md shadow-header fixed top-1/2 left-1/2 alert-transform w-[90vw] max-w-[45rem] max-h-[85vh] p-6 text-sm">
          <Dialog.Title className="text-lg font-semibold">
            Imprimir listagem de recibos
          </Dialog.Title>
          <form onSubmit={handleSubmit}>
            <Select
              value={farmToPrint}
              onChange={(e) => setFarmToPrint(e.target.value)}
              label="Fazenda"
              className="mt-5"
              defaultValue={0}
            >
              <option value={0}>Todas as fazendas</option>
              {farms.map((farm, index) => (
                <option key={index} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </Select>
            <div className="flex justify-end gap-3 mt-4">
              <Button size="medium">Imprimir</Button>
            </div>
          </form>
          <Dialog.Close>
            <button
              aria-label="Close"
              className="rounded-full inline-flex items-center justify-center absolute top-[10px] right-[10px]"
            >
              <X className="w-4 h-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
