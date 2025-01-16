import { Button, useToast, Flex } from '@chakra-ui/react'
import { useSolana } from '@embarky/react'
import bs58 from 'bs58'
import type { SolanaSignInInput } from '@solana/wallet-standard-features'
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'

export default function SolanaTx() {
  const toast = useToast({ position: 'bottom-right', duration: 3000 })
  const {
    wallet,
    wallets,
    publicKey,
    address,
    connection,
    signMessage,
    sendTransaction,
    signTransaction,
    signIn,
  } = useSolana()
  const supportedTransactionVersions = wallet?.supportedTransactionVersions
  async function onSendTransation() {
    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext()

    const transaction = new Transaction({
      feePayer: publicKey,
      recentBlockhash: blockhash,
    }).add(
      new TransactionInstruction({
        data: Buffer.from('Hello, from the Solana Wallet Adapter example app!'),
        keys: [],
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
      })
    )
    const signature = await sendTransaction?.(transaction, connection, {
      minContextSlot,
    })
    if (signature) {
      const res = await connection?.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      })

      toast({
        title: 'success',
        description: <span>Transaction successful!</span>,
      })
    }
  }

  async function onSignMessage() {
    const message = 'Hello2'
    const messageBuffer = Buffer.from(message)

    const signature = await signMessage?.(messageBuffer)

    if (signature) {
      toast({
        title: 'Signature successfully',
        description: bs58.encode(signature),
      })
    }
  }

  async function onSignTransaction() {
    try {
      if (!publicKey) throw new Error('Wallet not connected!')
      if (!signTransaction)
        throw new Error('Wallet does not support transaction signing!')

      const { blockhash } = await connection.getLatestBlockhash()

      let transaction = new Transaction({
        feePayer: publicKey,
        recentBlockhash: blockhash,
      }).add(
        new TransactionInstruction({
          data: Buffer.from(
            'Hello, from the Solana Wallet Adapter example app!'
          ),
          keys: [],
          programId: new PublicKey(
            'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
          ),
        })
      )

      transaction = await signTransaction(transaction)
      if (!transaction.signature) throw new Error('Transaction not signed!')
      const signature = bs58.encode(transaction.signature)
      toast({
        title: `Transaction signed ${signature}`,
      })
      if (!transaction.verifySignatures())
        throw new Error(`Transaction signature invalid! ${signature}`)
      toast({
        title: `Transaction signature valid! ${signature}`,
      })
    } catch (error: any) {
      toast({
        title: `Transaction signing failed! ${error?.message}`,
      })
    }
  }
  async function onSendV0Transaction() {
    try {
      if (!publicKey) throw new Error('Wallet not connected!')
      if (!supportedTransactionVersions)
        throw new Error("Wallet doesn't support versioned transactions!")
      if (!supportedTransactionVersions.has(0))
        throw new Error("Wallet doesn't support v0 transactions!")

      const { value: lookupTable } = await connection.getAddressLookupTable(
        new PublicKey('F3MfgEJe1TApJiA14nN2m4uAH4EBVrqdBnHeGeSXvQ7B')
      )
      if (!lookupTable) throw new Error("Address lookup table wasn't found!")

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext()

      const message = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: [
          {
            data: Buffer.from(
              'Hello, from the Solana Wallet Adapter example app!'
            ),
            keys: lookupTable.state.addresses.map((pubkey, index) => ({
              pubkey,
              isWritable: index % 2 == 0,
              isSigner: false,
            })),
            programId: new PublicKey(
              'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo'
            ),
          },
        ],
      })
      const transaction = new VersionedTransaction(
        message.compileToV0Message([lookupTable])
      )

      const signature = await sendTransaction?.(transaction, connection, {
        minContextSlot,
      })
      toast({
        title: `Transaction sent: ${signature}`,
      })
      // @ts-ignore
      await connection?.confirmTransaction?.({
        blockhash,
        lastValidBlockHeight,
        signature,
      })
      toast({
        title: `Transaction successful!: ${signature}`,
      })
    } catch (error: any) {
      toast({
        title: `Transaction failed! ${error?.message}`,
      })
    }
  }

  async function onSendLegacyTransaction() {
    try {
      if (!publicKey) throw new Error('Wallet not connected!')
      if (!supportedTransactionVersions)
        throw new Error("Wallet doesn't support versioned transactions!")
      if (!supportedTransactionVersions.has('legacy'))
        throw new Error("Wallet doesn't support legacy transactions!")

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext()

      const message = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: [
          {
            data: Buffer.from(
              'Hello, from the Solana Wallet Adapter example app!'
            ),
            keys: [],
            programId: new PublicKey(
              'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
            ),
          },
        ],
      })
      const transaction = new VersionedTransaction(
        message.compileToLegacyMessage()
      )

      const signature = await sendTransaction?.(transaction, connection, {
        minContextSlot,
      })

      toast({
        title: `Transaction sent: ${signature}`,
      })
      // @ts-ignore
      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      })
      toast({
        title: `Transaction successful!: ${signature}`,
      })
    } catch (error: any) {
      toast({
        title: `Transaction failed! ${error?.message}`,
      })
    }
  }

  async function onRequestAirdrop() {
    try {
      if (!publicKey) throw new Error('Wallet not connected!')

      const signature = await connection.requestAirdrop(
        publicKey,
        LAMPORTS_PER_SOL
      )
      toast({
        title: `Airdrop requested: ${signature}`,
      })
      await connection.confirmTransaction(signature, 'processed')
      toast({
        title: `Airdrop successful: ${signature}`,
      })
    } catch (error: any) {
      toast({
        title: `Airdrop failed! ${error?.message}`,
      })
    }
  }

  async function onSignIn() {
    try {
      if (!signIn)
        throw new Error('Wallet does not support Sign In With Solana!')

      const input: SolanaSignInInput = {
        domain: window.location.host,
        address: publicKey ? publicKey.toBase58() : undefined,
        statement: 'Please sign in.',
      }
      const output = await signIn(input)
      toast({
        title: `success`,
        description: `Message signature: ${bs58.encode(output.signature)}`,
      })
    } catch (error: any) {
      toast({
        title: `error`,
        description: `Sign In failed: ${error?.message}`,
      })
    }
  }
  return (
    <div>
      <div>Address:{address}</div>
      <div>publicKey:{publicKey?.toString()}</div>
      <Flex flexWrap={'wrap'} gap="20px" marginTop={'20px'}>
        <Button onClick={() => onSignMessage()}>signMessage</Button>
        <Button onClick={() => onSignTransaction()}>SignTransaction</Button>
        <Button onClick={() => onSignIn()}>SignIn</Button>

        <Button onClick={() => onRequestAirdrop()}>RequestAirdrop</Button>
        <Button onClick={() => onSendTransation()}>SendTransaction</Button>
        <Button
          disabled={!publicKey || !supportedTransactionVersions?.has('legacy')}
          onClick={() => onSendLegacyTransaction()}
        >
          SendLegacyTransaction
        </Button>
        <Button
          onClick={() => onSendV0Transaction()}
          disabled={!publicKey || !supportedTransactionVersions?.has(0)}
        >
          SendV0Transaction
        </Button>
      </Flex>
    </div>
  )
}
