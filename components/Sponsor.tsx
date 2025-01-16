import { useState } from 'react'
import { useAptos } from '@embarky/react'
import { Flex, Box, Button, useToast } from '@chakra-ui/react'
import {
  Account,
  AccountAuthenticator,
  AnyRawTransaction,
} from '@aptos-labs/ts-sdk'
import { TransactionHash } from './TransactionHash'

const APTOS_COIN = '0x1::aptos_coin::AptosCoin'

export function Sponsor() {
  const {
    network,
    account,
    client,
    isSendableNetwork,
    signTransaction,
    submitTransaction,
    generateTransaction,
  } = useAptos()

  const toast = useToast({
    position: 'bottom-right',
    duration: 3000,
  })
  const isDevNet = network?.name == 'devnet'
  const [transactionToSubmit, setTransactionToSubmit] =
    useState<AnyRawTransaction | null>(null)

  const [senderAuthenticator, setSenderAuthenticator] =
    useState<AccountAuthenticator>()
  const [feepayerAuthenticator, setFeepayerAuthenticator] =
    useState<AccountAuthenticator>()

  const sendable = isSendableNetwork(!!account?.address, network?.name)

  const onSignTransaction = async () => {
    if (!account?.address) return
    const transaction = await generateTransaction({
      sender: account?.address,
      withFeePayer: true,
      data: {
        function: '0x1::coin::transfer',
        typeArguments: [APTOS_COIN],
        functionArguments: [account?.address, 1], // 1 is in Octas
      },
    })
    if (transaction) {
      setTransactionToSubmit(transaction)

      try {
        const authenticator = await signTransaction(transaction)
        setSenderAuthenticator(authenticator)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const onSignTransactionAsSponsor = async () => {
    if (!transactionToSubmit) {
      throw new Error('No Transaction to sign')
    }
    try {
      // create sponsor account
      const SPONSOR_INITIAL_BALANCE = 100_000_000
      const sponsor = Account.generate()

      await client
        ?.fundAccount({
          accountAddress: sponsor.accountAddress,
          amount: SPONSOR_INITIAL_BALANCE,
        })
        .catch((e) => console.log('ee', e))
      const authenticator = await client?.transaction?.signAsFeePayer({
        signer: sponsor,
        transaction: transactionToSubmit,
      })

      setFeepayerAuthenticator(authenticator)
      toast({
        title: 'success',
      })
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmitTransaction = async () => {
    if (!transactionToSubmit) {
      throw new Error('No Transaction to sign')
    }
    if (!senderAuthenticator) {
      throw new Error('No senderAuthenticator')
    }
    if (!feepayerAuthenticator) {
      throw new Error('No feepayerAuthenticator')
    }
    try {
      const response = await submitTransaction({
        transaction: transactionToSubmit,
        senderAuthenticator,
        feePayerAuthenticator: feepayerAuthenticator,
      })
      toast({
        title: 'Success',
        description: <TransactionHash hash={response.hash} network={network} />,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box mt="16px">
      <Box>Sponsor Transaction Flow</Box>
      <Flex gap="20px">
        <Button onClick={onSignTransaction} isDisabled={!sendable || !isDevNet}>
          Sign as sender(Devnet)
        </Button>
        <Button
          onClick={onSignTransactionAsSponsor}
          isDisabled={!sendable || !senderAuthenticator || !isDevNet}
        >
          Sign as sponsor (Devnet)
        </Button>
        <Button
          onClick={onSubmitTransaction}
          isDisabled={!sendable || !senderAuthenticator || !isDevNet}
        >
          Submit transaction(Devnet)
        </Button>
      </Flex>
    </Box>
  )
}
