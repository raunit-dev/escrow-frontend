function EscrowCard({ account, isOwner }) {
  const { takeEscrow, refundEscrow } = useEscrowProgram()
  const escrowState = account.account
  const escrowAddress = account.publicKey
  
  const handleTake = async () => {
    try {
      await takeEscrow.mutateAsync({
        escrowAddress,
        maker: escrowState.maker,
        mintA: escrowState.mintA,
        mintB: escrowState.mintB,
      })
    } catch (error) {
      console.error('Error taking escrow:', error)
    }
  }
  
  const handleRefund = async () => {
    try {
      await refundEscrow.mutateAsync({
        escrowAddress,
        import { useState, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useEscrowProgram } from './escrow-data-access'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ExplorerLink } from '@/components/cluster/cluster-ui'
import { ellipsify } from '@/lib/utils'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function EscrowActions() {
  const { publicKey } = useWallet()
  
  if (!publicKey) return null
  
  return (
    <Tabs defaultValue="create" className="w-full max-w-md">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="take">Take</TabsTrigger>
        <TabsTrigger value="refund">Refund</TabsTrigger>
      </TabsList>
      
      <TabsContent value="create">
        <CreateEscrowForm />
      </TabsContent>
      
      <TabsContent value="take">
        <TakeEscrowForm />
      </TabsContent>
      
      <TabsContent value="refund">
        <RefundEscrowForm />
      </TabsContent>
    </Tabs>
  )
}

function CreateEscrowForm() {
  const [mintA, setMintA] = useState('')
  const [mintB, setMintB] = useState('')
  const [amount, setAmount] = useState('')
  const [receiveAmount, setReceiveAmount] = useState('')
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000).toString())
  
  const { makeEscrow } = useEscrowProgram()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!mintA || !mintB || !amount || !receiveAmount || !seed) {
      toast.error('Please fill all fields')
      return
    }
    
    try {
      await makeEscrow.mutateAsync({
        mintA: new PublicKey(mintA),
        mintB: new PublicKey(mintB),
        amount: Number(amount),
        receiveAmount: Number(receiveAmount),
        seed: Number(seed),
      })
      
      // Clear form on success
      setAmount('')
      setReceiveAmount('')
      setSeed(Math.floor(Math.random() * 1000000).toString())
    } catch (error) {
      console.error('Error creating escrow:', error)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Escrow</CardTitle>
        <CardDescription>
          Lock your tokens in an escrow until someone trades with you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mintA">Token to Deposit (Mint A)</Label>
            <Input 
              id="mintA" 
              placeholder="Token Mint Address" 
              value={mintA} 
              onChange={(e) => setMintA(e.target.value)} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Deposit</Label>
            <Input 
              id="amount" 
              type="number" 
              placeholder="Amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required
              min="1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mintB">Token to Receive (Mint B)</Label>
            <Input 
              id="mintB" 
              placeholder="Token Mint Address" 
              value={mintB} 
              onChange={(e) => setMintB(e.target.value)} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="receiveAmount">Amount to Receive</Label>
            <Input 
              id="receiveAmount" 
              type="number" 
              placeholder="Amount" 
              value={receiveAmount} 
              onChange={(e) => setReceiveAmount(e.target.value)} 
              required
              min="1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="seed">Escrow Seed</Label>
            <Input 
              id="seed" 
              type="number" 
              placeholder="Unique Seed Number" 
              value={seed} 
              onChange={(e) => setSeed(e.target.value)} 
              required
              min="1"
            />
            <p className="text-xs text-muted-foreground">
              A unique identifier for this escrow (auto-generated)
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit} 
          disabled={makeEscrow.isPending}
          className="w-full"
        >
          {makeEscrow.isPending ? 'Creating...' : 'Create Escrow'}
        </Button>
      </CardFooter>
    </Card>
  )
}

function TakeEscrowForm() {
  const [escrowAddress, setEscrowAddress] = useState('')
  const [maker, setMaker] = useState('')
  const [mintA, setMintA] = useState('')
  const [mintB, setMintB] = useState('')
  
  const { takeEscrow } = useEscrowProgram()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await takeEscrow.mutateAsync({
        escrowAddress: new PublicKey(escrowAddress),
        maker: new PublicKey(maker),
        mintA: new PublicKey(mintA),
        mintB: new PublicKey(mintB),
      })
    } catch (error) {
      console.error('Error taking escrow:', error)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Take Escrow</CardTitle>
        <CardDescription>
          Exchange your tokens for the locked tokens in an escrow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="escrowAddress">Escrow Address</Label>
            <Input 
              id="escrowAddress" 
              placeholder="Escrow Account Address" 
              value={escrowAddress} 
              onChange={(e) => setEscrowAddress(e.target.value)} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maker">Maker Address</Label>
            <Input 
              id="maker" 
              placeholder="Maker's Wallet Address" 
              value={maker} 
              onChange={(e) => setMaker(e.target.value)} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mintA">Token A Mint</Label>
            <Input 
              id="mintA" 
              placeholder="Token A Mint Address" 
              value={mintA} 
              onChange={(e) => setMintA(e.target.value)} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mintB">Token B Mint</Label>
            <Input 
              id="mintB" 
              placeholder="Token B Mint Address" 
              value={mintB} 
              onChange={(e) => setMintB(e.target.value)} 
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit} 
          disabled={takeEscrow.isPending}
          className="w-full"
        >
          {takeEscrow.isPending ? 'Processing...' : 'Take Escrow'}
        </Button>
      </CardFooter>
    </Card>
  )
}

function RefundEscrowForm() {
  const [escrowAddress, setEscrowAddress] = useState('')
  const [mintA, setMintA] = useState('')
  
  const { refundEscrow } = useEscrowProgram()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await refundEscrow.mutateAsync({
        escrowAddress: new PublicKey(escrowAddress),
        mintA: new PublicKey(mintA),
      })
    } catch (error) {
      console.error('Error refunding escrow:', error)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Refund Escrow</CardTitle>
        <CardDescription>
          Retrieve your tokens from an escrow you created
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="escrowAddress">Escrow Address</Label>
            <Input 
              id="escrowAddress" 
              placeholder="Escrow Account Address" 
              value={escrowAddress} 
              onChange={(e) => setEscrowAddress(e.target.value)} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mintA">Token Mint</Label>
            <Input 
              id="mintA" 
              placeholder="Token Mint Address" 
              value={mintA} 
              onChange={(e) => setMintA(e.target.value)} 
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit} 
          disabled={refundEscrow.isPending}
          className="w-full"
        >
          {refundEscrow.isPending ? 'Processing...' : 'Refund Escrow'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function EscrowList() {
  const { getEscrowAccounts } = useEscrowProgram()
  const { publicKey } = useWallet()
  
  const [filter, setFilter] = useState("all")
  
  const accounts = getEscrowAccounts.data || []
  
  const filteredAccounts = useMemo(() => {
    if (!accounts.length) return []
    
    switch (filter) {
      case "my":
        return accounts.filter(
          account => publicKey && account.account.maker.toString() === publicKey.toString()
        )
      case "available":
        return accounts.filter(
          account => !publicKey || account.account.maker.toString() !== publicKey.toString()
        )
      default:
        return accounts
    }
  }, [accounts, publicKey, filter])
  
  if (getEscrowAccounts.isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (accounts.length === 0) {
    return (
      <Alert>
        <AlertTitle>No escrows found</AlertTitle>
        <AlertDescription>
          Create a new escrow to get started with the exchange!
        </AlertDescription>
      </Alert>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Escrow List</h2>
        
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All Escrows
          </Button>
          
          <Button 
            size="sm" 
            variant={filter === "my" ? "default" : "outline"}
            onClick={() => setFilter("my")}
          >
            My Escrows
          </Button>
          
          <Button 
            size="sm" 
            variant={filter === "available" ? "default" : "outline"}
            onClick={() => setFilter("available")}
          >
            Available
          </Button>
        </div>
      </div>
      
      {filteredAccounts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <h3 className="text-lg font-medium">No {filter === "my" ? "personal" : filter === "available" ? "available" : ""} escrows found</h3>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAccounts.map((account) => (
            <EscrowCard 
              key={account.publicKey.toString()} 
              account={account} 
              isOwner={publicKey?.toString() === account.account.maker.toString()}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function EscrowCard({ account, isOwner }) {
  const { takeEscrow, refundEscrow } = useEscrowProgram()
  const escrowState = account.account
  const escrowAddress = account.publicKey
  
  const handleTake = async () => {
    try {
      await takeEscrow.mutateAsync({
        escrowAddress,
        maker: escrowState.maker,
        mintA: escrowState.mintA,
        mintB: escrowState.mintB,
      })
    } catch (error) {
      console.error('Error taking escrow:', error)
    }
  }
  
  const handleRefund = async () => {
    try {
      await refundEscrow.mutateAsync({
        escrowAddress,
        mintA: escrowState.mintA,
      })
    } catch (error) {
      console.error('Error refunding escrow:', error)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escrow</CardTitle>
        <CardDescription>
          <ExplorerLink 
            path={`account/${escrowAddress.toString()}`} 
            label={ellipsify(escrowAddress.toString())} 
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Creator</span>
            <span className="font-mono text-sm">
              {ellipsify(escrowState.maker.toString())}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Offering</span>
            <span>
              {escrowState.receiveAmount.toString()} tokens of{' '}
              <ExplorerLink 
                path={`account/${escrowState.mintB.toString()}`} 
                label={ellipsify(escrowState.mintB.toString())} 
              />
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">For</span>
            <span>
              tokens of{' '}
              <ExplorerLink 
                path={`account/${escrowState.mintA.toString()}`} 
                label={ellipsify(escrowState.mintA.toString())} 
              />
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {isOwner ? (
          <Button 
            onClick={handleRefund} 
            disabled={refundEscrow.isPending}
            className="w-full"
          >
            {refundEscrow.isPending ? 'Processing...' : 'Refund'}
          </Button>
        ) : (
          <Button 
            onClick={handleTake} 
            disabled={takeEscrow.isPending}
            className="w-full"
          >
            {takeEscrow.isPending ? 'Processing...' : 'Take Offer'}
          </Button>
        )}
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Details</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Escrow Details</DialogTitle>
              <DialogDescription>
                <ExplorerLink 
                  path={`account/${escrowAddress.toString()}`} 
                  label={escrowAddress.toString()} 
                />
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Maker</h4>
                <p className="font-mono text-sm break-all">
                  {escrowState.maker.toString()}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Token A (Requested)</h4>
                <p className="font-mono text-sm break-all">
                  {escrowState.mintA.toString()}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Token B (Offered)</h4>
                <p className="font-mono text-sm break-all">
                  {escrowState.mintB.toString()}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Amount to Receive</h4>
                <p>{escrowState.receiveAmount.toString()}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Seed</h4>
                <p>{escrowState.seed.toString()}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}