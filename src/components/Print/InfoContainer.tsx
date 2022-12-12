interface InfoContainerProps {
  type: 'payer' | 'recipient'
}

export function InfoContainer({ type }: InfoContainerProps) {
  return (
    <div className="w-full flex flex-col">
      <span className="pt-4 font-medium border-b border-black">
        {(type === 'payer' ? 'PAGADOR' : 'BENEFICIÁRIO') + ':'}
      </span>
      <div className="flex flex-col gap-2 [&_span]:h-[29px] text-left ml-auto mr-10 font-medium">
        <span className="flex items-center">Nome:</span>
        <span className="flex items-center">Endereço:</span>
        <span className="flex items-center">CNPJ:</span>
      </div>
    </div>
  )
}
