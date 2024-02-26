import React, { useState, useEffect } from 'react'
import { Flex, Text, Box } from '@chakra-ui/react'
import { useEmbarky } from '@embarky/react'
import { useRouter, useParams } from 'next/navigation'
import Image from '@/components/Image'
import Logo from '/public/logo.svg'

export default function Layout({ children }) {
  const router = useRouter()
  const { authenticated } = useEmbarky()

  useEffect(() => {
    if (!authenticated) {
      router.push('/', { scroll: false })
    } else {
      router.push('/dashboard', { scroll: false })
    }
  }, [authenticated, router])

  if (!authenticated) {
    return <main>{children}</main>
  }

  return (
    <main>
      <Box minH={'100vh'} bg={'dark.bg'}>
        <Flex
          alignItems={'center'}
          fontWeight={500}
          px={'34px'}
          h={'68px'}
          bg={'dark.bg'}
        >
          <Image src={Logo} height={20} mr={'6px'} />
          <Flex
            fontSize={'xs'}
            ml={'6px'}
            px={'6px'}
            borderRadius={'16px'}
            color={'brand'}
            borderColor={'brand'}
            borderWidth={'1px'}
          >
            Demo
          </Flex>
        </Flex>

        <Box bg={'dark.bg'}>
          <Box
            mx={'24px'}
            h={'calc(100vh - 94px)'}
            borderRadius={'16px'}
            color={'brand'}
            borderColor={'border'}
            borderWidth={'1px'}
            overflowY={'scroll'}
            bg={'dark.grayBg'}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </main>
  )
}
