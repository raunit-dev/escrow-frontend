import { PublicKey } from '@solana/web3.js'

export interface EscrowAccount {
  publicKey: PublicKey
  account: {
    seed: number
    bump: number
    mintA: PublicKey
    mintB: PublicKey
    receiveAmount: number
    maker: PublicKey
  }
}

export interface CreateEscrowParams {
  mintA: PublicKey
  mintB: PublicKey
  amount: number
  receiveAmount: number
  seed: number
}

export interface TakeEscrowParams {
  escrowAddress: PublicKey
  maker: PublicKey
  mintA: PublicKey
  mintB: PublicKey
}

export interface RefundEscrowParams {
  escrowAddress: PublicKey
  mintA: PublicKey  
}