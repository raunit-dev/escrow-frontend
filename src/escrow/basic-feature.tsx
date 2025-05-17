import { useWallet } from '@solana/wallet-adapter-react'
import { ExplorerLink } from '@/components/cluster/cluster-ui'
import { WalletButton } from '@/components/solana/solana-provider'
import { AppHero } from '@/components/app-hero'
import { ellipsify } from '@/lib/utils'
import { useEscrowProgram } from './escrow-data-access'
import { EscrowActions, EscrowList } from './escrow-ui'

export default function EscrowFeature() {
  const { publicKey } = useWallet()
  const { programId } = useEscrowProgram()

  return publicKey ? (
    <div>
      <AppHero 
        title="Solana Escrow" 
        subtitle="Create, take, or refund token escrows on Solana"
      >
        <p className="mb-6">
          <ExplorerLink 
            path={`account/${programId}`} 
            label={ellipsify(programId.toString())} 
          />
        </p>
        <EscrowActions />
      </AppHero>
      <div className="container mx-auto px-4 py-8">
        <EscrowList />
      </div>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-8">Solana Escrow</h1>
            <p className="mb-8">Connect your wallet to create and interact with token escrows</p>
            <WalletButton className="btn btn-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}