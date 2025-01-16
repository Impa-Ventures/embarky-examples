import React, { useEffect } from 'react'
import { Flex, Box } from '@chakra-ui/react'
import { useEmbarky } from '@embarky/react'
import { useRouter } from 'next/navigation'
import { logoDark } from '@/utils'
import { ConfigProvider } from './ConfigProvider'

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

  return (
    <main>
      <Box h={'100vh'} bg={'dark.bg'} overflow={'hidden'}>
        <Flex
          alignItems={'center'}
          fontWeight={500}
          px={'34px'}
          h={'68px'}
          bg={'dark.bg'}
        >
          <img
            src={logoDark}
            style={{
              height: '32px',
              marginRight: '6px',
            }}
          />
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
            <ConfigProvider>{children}</ConfigProvider>
          </Box>
        </Box>
      </Box>
    </main>
  )
}
