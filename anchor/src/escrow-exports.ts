// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import EscrowDL from '../target/idl/escrow.json'
import type { Escrow } from '../target/types/escrow'

// Re-export the generated IDL and type
export { Escrow, EscrowDL }

// The programId is imported from the program IDL.
export const ESCROW_PROGRAM_ID = new PublicKey(EscrowDL.address)

// This is a helper function to get the Basic Anchor program.
export function getEscrowProgram(provider: AnchorProvider, address?: PublicKey): Program<Escrow> {
  return new Program({ ...EscrowDL, address: address ? address.toBase58() : EscrowDL.address } as Escrow, provider)
}

// This is a helper function to get the program ID for the Basic program depending on the cluster.
export function getEscrowProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Basic program on devnet and testnet.
      return new PublicKey('ATqMRvwjJK28Sa8C3yUYZ9DnJip2pBTPsQD5uSWeUWBj')
    case 'mainnet-beta':
    default:
      return ESCROW_PROGRAM_ID
  }
}
