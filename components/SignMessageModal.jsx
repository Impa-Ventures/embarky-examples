'use client'
import React, { useState, useCallback } from 'react'
import {
  Box,
  Text,
  Flex,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalOverlay,
} from '@chakra-ui/react'
import { useEmbarky, getSignMessage } from '@embarky/react'

export default function SignMessageModal({ onClose, onSuccess, onFailed }) {
  const { userAccount, getEmbeddedWallet } = useEmbarky()

  const walletObj = userAccount?.wallets?.find(
    (item) => item.wallet_client === 'embarky'
  )

  const signMessage = async () => {
    try {
      const wallet = await getEmbeddedWallet()
      const message = await getSignMessage(walletObj.wallet_address)
      const res = await wallet.signMessage({
        message,
      })
      console.log('signMessage:res---', res)
      onSuccess()
    } catch (error) {
      onFailed()
    }
  }

  return (
    <Box>
      <Modal isCentered isOpen onClose={onClose} autoFocus={false}>
        <ModalOverlay />
        <ModalContent
          zIndex={101}
          borderRadius="30px"
          bgColor={'dark.bg'}
          w={'430px'}
        >
          <ModalHeader fontSize={'lg'} color={'theme.dark'}>
            <Flex direction="row" alignItems="center">
              <Text>Sign message</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color={'gray.darker'} />
          <ModalBody p="0 30px 30px">
            <Box>
              <Text fontSize={'14px'} color={'second'}>
                Signing this message will not cost you any fees.
              </Text>
              <Box
                mt="16px"
                color={'primary'}
                bg={'dark.lightBg'}
                py={'4px'}
                pl={'8px'}
                borderRadius={'6px'}
                fontSize={'14px'}
              >
                <Text>Signing with the active wallet in Impa: </Text>
                <Text>{walletObj?.wallet_address}</Text>
              </Box>

              <Button
                w={'full'}
                mt={'32px'}
                bg={'brand'}
                fontSize={'14px'}
                onClick={signMessage}
              >
                Sign and continue
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
