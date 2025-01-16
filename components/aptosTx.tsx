import { useCallback, useState } from 'react'
import { useAptos } from '@embarky/react'
import { Flex, Box, Button, useToast } from '@chakra-ui/react'
// @ts-ignore
import { useAccount } from 'wagmi'
// @ts-ignore
import { Account } from '@aptos-labs/ts-sdk' // eslint-disable-line

import { TransactionHash } from './TransactionHash'
import { Sponsor } from './Sponsor'

const APTOS_COIN = '0x1::aptos_coin::AptosCoin'
export default function AptosTx() {
  const {
    network,
    client: aptosClient,
    account,
    connected,
    isSendableNetwork,
    signTransaction,
    signMessageAndVerify,
    submitTransaction,
    signMessage,
    signAndSubmitTransaction,
    generateTransaction,
    generateMultiAgentTransaction,
  } = useAptos()
  const { address } = useAccount()
  const toast = useToast({
    position: 'bottom-right',
    duration: 3000,
  })

  const [transactionToSubmit, setTransactionToSubmit] = useState()
  const [secondarySignerAccount, setSecondarySignerAccount] = useState()
  const [senderAuthenticator, setSenderAuthenticator] = useState()
  const [secondarySignerAuthenticator, setSecondarySignerAuthenticator] =
    useState()

  const sendable = isSendableNetwork(connected, network?.name)
  const onSignMessageAndVerify = async () => {
    const payload = {
      message: 'Hello from Aptos Wallet Adapter',
      nonce: Math.random().toString(16),
    }
    const response = await signMessageAndVerify(payload)
    console.log('response', response)
    toast({
      title: 'Success',
      description: JSON.stringify({ onSignMessageAndVerify: response }),
    })
  }
  const [signature, setSignature] = useState({})
  const [message1, setMessaage1] = useState('')
  const onSignMessage = async () => {
    const payload = {
      message: message1 || 'Hello from Aptos Wallet Adapter',
      nonce: Math.random().toString(16),
    }
    const response = await signMessage(payload)
    setSignature({ ...response, signature: response.signature?.toString() })
    toast({
      title: 'Success',
      description: JSON.stringify({ onSignMessage: response }),
    })
  }

  const onSignAndSubmitTransaction = useCallback(async () => {
    if (!address) return
    const transaction = {
      data: {
        function: '0x1::coin::transfer',
        typeArguments: [APTOS_COIN],
        functionArguments: [address, 1],
      },
    }
    try {
      // @ts-ignore
      const response = await signAndSubmitTransaction(transaction)
      await aptosClient?.waitForTransaction({
        transactionHash: response.hash,
      })
      toast({
        title: 'Success',
        description: <TransactionHash hash={response.hash} network={network} />,
      })
    } catch (error) {
      console.error(error)
    }
  }, [address, aptosClient])

  const onSignTransaction = async () => {
    try {
      const payload = {
        type: 'entry_function_payload',
        function: '0x1::coin::transfer',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
        arguments: [address, 1],
      }
      const response = await signTransaction(payload)
      toast({
        title: 'Success',
        description: JSON.stringify(response),
      })
    } catch (error) {
      console.error(error)
    }
  }

  const onSignTransactionV2 = async () => {
    if (!address) return

    try {
      const transactionToSign = await generateTransaction({
        sender: address,
        data: {
          function: '0x1::coin::transfer',
          typeArguments: [APTOS_COIN],
          functionArguments: [address, 1],
        },
      })
      // @ts-ignore
      const response = await signTransaction(transactionToSign)

      toast({
        title: 'Success',
        description: JSON.stringify(response),
      })
    } catch (error) {
      console.error(error)
    }
  }

  const onSenderSignTransaction = useCallback(async () => {
    const secondarySigner = Account.generate()
    // TODO: support custom network
    const tx = await aptosClient
      ?.fundAccount({
        accountAddress: secondarySigner.accountAddress.toString(),
        amount: 100000000,
        options: { waitForIndexer: false },
      })
      .catch((e) => console.log('ee', e))
    console.log('tx', tx)
    // @ts-ignore
    setSecondarySignerAccount(secondarySigner)
    const transaction = await generateMultiAgentTransaction({
      sender: account?.address || '',
      secondarySignerAddresses: [secondarySigner.accountAddress],
      data: {
        function: '0x1::coin::transfer',
        typeArguments: [APTOS_COIN],
        functionArguments: [account?.address, 1],
      },
    })
    // @ts-ignore
    setTransactionToSubmit(transaction)
    try {
      // @ts-ignore
      const authenticator = await signTransaction(transaction)
      // @ts-ignore
      setSenderAuthenticator(authenticator)
    } catch (error) {
      console.error(error)
    }
  }, [aptosClient, account])

  const onSecondarySignerSignTransaction = async () => {
    if (!transactionToSubmit) {
      throw new Error('No Transaction to sign')
    }
    try {
      const authenticator = await signTransaction(transactionToSubmit)
      // @ts-ignore
      setSecondarySignerAuthenticator(authenticator)
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmitTransaction = async () => {
    try {
      if (!transactionToSubmit) {
        throw new Error('No Transaction to sign')
      }
      if (!senderAuthenticator) {
        throw new Error('No senderAuthenticator')
      }
      if (!secondarySignerAuthenticator) {
        throw new Error('No secondarySignerAuthenticator')
      }
      const response = await submitTransaction({
        transaction: transactionToSubmit,
        senderAuthenticator,
        additionalSignersAuthenticators: [secondarySignerAuthenticator],
      })
      toast({
        title: 'Success',
        description: <TransactionHash hash={response.hash} network={network} />,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Unable to submit multiagent Transaction.',
      })
      console.error(error)
    }
  }
  return (
    <>
      <Box>
        <Box>account.address: {account?.address}</Box>
        <Box>publick key: {account?.publicKey}</Box>
        <Box>netWork: {network ? JSON.stringify(network) : '-'}</Box>
      </Box>
      <Box width={'672px'}>
        <h3>Aptos transcation </h3>
        <Flex gap="16px" flexWrap={'wrap'} marginTop={'16px'}>
          <Button onClick={onSignAndSubmitTransaction} isDisabled={!sendable}>
            Sign and submit transaction
          </Button>
          <Button onClick={onSignTransaction} isDisabled={!sendable}>
            Sign transaction
          </Button>
          <Button onClick={onSignTransactionV2} isDisabled={!sendable}>
            Sign transaction V2
          </Button>
          <Button onClick={onSignMessage} isDisabled={!sendable}>
            Sign message
          </Button>
          <Button onClick={onSignMessageAndVerify} isDisabled={!sendable}>
            Sign message and verify
          </Button>
        </Flex>
        <Sponsor />
      </Box>
    </>
  )
}
