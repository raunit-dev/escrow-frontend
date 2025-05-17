import { getEscrowProgram, getEscrowProgramId } from '@project/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '@/components/cluster/cluster-data-access'
import { useTransactionToast } from '@/components/use-transaction-toast'
import { toast } from 'sonner'
import { useAnchorProvider } from '@/components/solana/use-anchor-provider'
import { BN } from '@project/anchor'

export function useEscrowProgram() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getEscrowProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getEscrowProgram(provider, programId), [provider, programId])

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  // Query to fetch all escrow accounts 
  const getEscrowAccounts = useQuery({
    queryKey: ['get-escrow-accounts', { cluster, publicKey }],
    queryFn: async () => {
      try {
        const accounts = await program.account.escrowState.all()
        return accounts
      } catch (error) {
        console.error('Failed to fetch escrow accounts:', error)
        return []
      }
    },
    enabled: !!publicKey,
  })

  // Create escrow mutation
  const makeEscrow = useMutation({
    mutationKey: ['escrow', 'make', { cluster }],
    mutationFn: async ({ mintA, mintB, amount, receiveAmount, seed }: {
      mintA: PublicKey
      mintB: PublicKey
      amount: number
      receiveAmount: number 
      seed: number
    }) => {
      if (!publicKey) throw new Error('Wallet not connected')

      const signature = await program.methods
        .make(
          new BN(seed),
          new BN(receiveAmount),
          new BN(amount)
        )
        .accounts({
          maker: publicKey,
          mintA,
          mintB,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        })
        .rpc()

      return signature
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Escrow created successfully')
      // Invalidate queries to refresh data
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['get-escrow-accounts'] })
      ])
    },
  })

  // Refund an escrow
  const refundEscrow = useMutation({
    mutationKey: ['escrow', 'refund', { cluster }],
    mutationFn: async ({ escrowAddress, mintA }: { 
      escrowAddress: PublicKey,
      mintA: PublicKey
    }) => {
      const signature = await program.methods
        .refund()
        .accounts({
          escrow: escrowAddress,
          mintA,
        })
        .rpc()
      return signature
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Escrow refunded successfully')
    },
    onError: (error) => {
      console.error('Failed to refund escrow:', error)
      toast.error('Failed to refund escrow')
    },
  })

  // Take an escrow
  const takeEscrow = useMutation({
    mutationKey: ['escrow', 'take', { cluster }],
    mutationFn: async ({ escrowAddress, maker, mintA, mintB }: { 
      escrowAddress: PublicKey,
      maker: PublicKey,
      mintA: PublicKey,
      mintB: PublicKey
    }) => {
      const signature = await program.methods
        .take()
        .accounts({
          escrow: escrowAddress,
          maker,
          mintA,
          mintB,
        })
        .rpc()
      return signature
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      toast.success('Escrow taken successfully')
    },
    onError: (error) => {
      console.error('Failed to take escrow:', error)
      toast.error('Failed to take escrow')
    },
  })

  return {
    program,
    programId,
    getProgramAccount,
    getEscrowAccounts,
    makeEscrow,
    refundEscrow,
    takeEscrow,
  }
}