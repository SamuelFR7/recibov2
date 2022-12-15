import * as Separator from '@radix-ui/react-separator'

interface ReceiptProps {
  receipt: {
    number: number
    date: string
    value: number
    historic: string | null
    recipientName: string
    recipientAddress: string | null
    recipientDocument: string | null
    payerName: string | null
    payerAddress: string | null
    payerDocument: string | null
    farmId: string
  }
}

export function Receipt({ receipt }: ReceiptProps) {
  return (
    <div className="h-1/2 p-5 flex-col w-full flex text-sm">
      <header className="flex h-10 w-full flex-col">
        <div className="flex w-full justify-between font-bold">
          <h1 className="text-lg">RECIBO</h1>
          <span className="text-md">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(receipt.value)}
          </span>
        </div>
        <div className="flex w-full items-center mt-4 gap-3">
          <Separator.Root className="h-3 bg-grayHover w-full rounded-lg" />
          <div className="flex gap-1">
            <span className="font-semibold">Data: </span>
            <p>
              {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(
                new Date(receipt.date),
              )}
            </p>
          </div>
        </div>
      </header>
      <main className="mt-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col">
            <span className="font-semibold bg-grayHover px-2 py-1 w-[10rem] text-center rounded-t-lg">
              Pagador
            </span>
            <Separator.Root className="h-[1px] w-full bg-grayHover" />
            <div className="flex flex-col mt-4 px-2">
              <ul className="[&_li]:flex [&_li]:gap-2 [&_span]:font-semibold flex flex-col gap-2">
                <li>
                  <span>Nome:</span>
                  <p>{receipt.payerName}</p>
                </li>
                <li>
                  <span>Endereço:</span>
                  <p>{receipt.payerAddress}</p>
                </li>
                <li>
                  <span>CPF/CNPJ:</span>
                  <p>{receipt.payerDocument}</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold bg-grayHover px-2 py-1 w-[10rem] text-center rounded-t-lg">
              Recebedor
            </span>
            <Separator.Root className="h-[1px] w-full bg-grayHover" />
            <div className="flex flex-col mt-4 px-2">
              <ul className="[&_li]:flex [&_li]:gap-2 [&_span]:font-semibold flex flex-col gap-2">
                <li>
                  <span>Nome:</span>
                  <p>{receipt.recipientName}</p>
                </li>
                <li>
                  <span>Endereço:</span>
                  <p>{receipt.recipientAddress}</p>
                </li>
                <li>
                  <span>CPF/CNPJ:</span>
                  <p>{receipt.recipientDocument}</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold bg-grayHover px-2 py-1 w-[10rem] text-center rounded-t-lg">
              Histórico
            </span>
            <Separator.Root className="h-[1px] w-full bg-grayHover" />
            <span className="mt-4 px-2">{receipt.historic}</span>
          </div>
        </div>
      </main>
      <footer className="flex flex-col items-center mt-auto gap-2">
        <Separator.Root className="h-[1px] w-[50rem] bg-black" />
        <h1>{receipt.recipientName}</h1>
        <div className="w-full border-t-[2px] border-dotted border-grayHover" />
      </footer>
    </div>
  )
}
