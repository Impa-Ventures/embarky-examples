'use client'

import React, { useState, useEffect } from 'react'
import { useEmbarky } from '@embarky/react'
import {
  Box,
  Code,
  Flex,
  VStack,
  Button,
  CircularProgress,
  Center,
} from '@chakra-ui/react'
import Image from '../components/Image'
import logo from '../public/bg-logo.svg'

export default function Home() {
  const {
    login,
    authenticated,
    userAccount,
    logout,
    activeWallet,
    linkWallet,
    unlinkWallet,

    linkGoogle,
    unlinkGoogle,
    getEmbeddedWallet,
  } = useEmbarky()

  if (!authenticated) {
    return (
      <VStack>
        <Center mt={'200px'}>
          <Image src={logo} />
        </Center>
        <Button
          minW={'300px'}
          mt={'300px'}
          h={'50px'}
          bg={'white'}
          color={'brand'}
          _hover={{
            bg: 'white',
          }}
          onClick={login}
        >
          Sign in
        </Button>
      </VStack>
    )
  }

  const getWallet = () => {
    getEmbeddedWallet().then((wallet) => {
      console.log(wallet)
    })
  }

  return (
    <VStack>
      <Flex gap={'16px'} my={'32px'}>
        <Button onClick={logout}>logout</Button>
        <Button onClick={linkWallet}>linkWallet</Button>
        <Button onClick={linkGoogle}>linkGoogle</Button>
        <Button onClick={getWallet}>getEmbeddedWallet</Button>
      </Flex>
      <Code
        as="pre"
        padding={'16px'}
        borderRadius={'10px'}
        h={'calc(100vh - 246px)'}
        overflowY={'scroll'}
        fontSize={'12px'}
        color={'primary'}
        whiteSpace={'pre-wrap'}
        wordBreak={'break-all'}
      >
        {JSON.stringify(userAccount, null, 2)}
      </Code>
    </VStack>
  )
}
