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

export function PrintDialog({ children, farms }: ListDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [farmToPrint, setFarmToPrint] = useState<string | number>(0)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    window.open(`/api/receipts/print/by-farm/${farmToPrint}`)
    setFarmToPrint(0)
    return setIsOpen(false)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-modalBg fixed inset-0 dialog-overlay" />
        <Dialog.Content className="bg-white rounded-md shadow-header dialog-content fixed top-1/2 left-1/2 alert-transform w-[90vw] max-w-[45rem] max-h-[85vh] p-6 text-sm">
          <Dialog.Title className="text-lg font-medium">
            Imprimir recibos
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
