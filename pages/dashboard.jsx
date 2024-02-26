import React, { useState, useEffect, useMemo } from 'react'
import {
  Button,
  Code,
  Box,
  Flex,
  Text,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { useEmbarky } from '@embarky/react'
import Image from '@/components/Image'
import { formatAddress } from '@/utils'
import googleImg from '@/images/social/google.svg'
import walletImg from '@/images/icon/wallet.svg'
import socialImg from '@/images/icon/social.svg'
import linkImg from '@/images/icon/link.svg'
import unlinkImg from '@/images/icon/unlink.svg'
import actionImg from '@/images/icon/action.svg'
import lockImg from '@/images/icon/lock.svg'
import editImg from '@/images/icon/edit.svg'
import SignMessageModal from '@/components/SignMessageModal'

const SIGN_STATUS = {
  INIT: 0,
  SIGNING: 1,
  SUCCESS: 2,
  FAILED: 3,
}

export default function Dashboard() {
  const {
    logout,
    userAccount,
    deleteAccount,
    linkWallet,
    unlinkWallet,
    linkGoogle,
    unlinkGoogle,
    activeWallet,
    connectWallet,
    exportWallet,
  } = useEmbarky()
  const { address, isConnected } = useAccount()
  const [isSignMessageOpen, setIsSignMessageOpen] = useState(false)
  const [signStatus, setSignStatus] = useState(SIGN_STATUS.INIT)
  const [hoverWallet, setHoverWallet] = useState('')
  const { disconnectAsync } = useDisconnect()

  const [isLargerThan900] = useMediaQuery('(min-width: 900px)')

  const { isLoading: isSigning, signMessageAsync } = useSignMessage({
    message: 'impa_ventures',
  })

  const googleObj = userAccount?.socials?.find(
    (item) => item.social_type === 'google'
  )

  const embeddedWallet = userAccount?.wallets?.find(
    (item) => item.wallet_client === 'impa'
  )

  const isActive = (wallet) => {
    if (!wallet) return false
    const isConnectedWallet = wallet.wallet_address === address
    const isImpaWallet = wallet.wallet_client === 'impa'
    return wallet.is_active && (isConnectedWallet || isImpaWallet)
  }

  const unlinkWalletDisable = userAccount?.wallets?.length === 1

  const onGoogle = () => {
    if (googleObj) {
      unlinkGoogle(googleObj.social_subject)
    } else {
      linkGoogle()
    }
  }

  const onUnlinkWallet = (wallet_address) => {
    if (unlinkWalletDisable) return
    unlinkWallet(wallet_address)
  }

  const onSignMessage = async () => {
    const activedWallet = (userAccount?.wallets || []).find((item) =>
      isActive(item)
    )

    if (!activeWallet) return

    if (activedWallet?.wallet_client === 'impa') {
      setIsSignMessageOpen(true)
    } else {
      setSignStatus(SIGN_STATUS.SIGNING)
      try {
        await signMessageAsync()
        setSignStatus(SIGN_STATUS.SUCCESS)
      } catch (error) {
        setSignStatus(SIGN_STATUS.FAILED)
      }
    }
  }

  const onSignMessageSuccess = () => {
    setSignStatus(SIGN_STATUS.SUCCESS)
    setIsSignMessageOpen(false)
  }
  const onSignMessageFailed = () => {
    setSignStatus(SIGN_STATUS.FAILED)
    setIsSignMessageOpen(false)
  }

  useEffect(() => {
    const canActiveList = (userAccount?.wallets || []).filter((item) => {
      const isConnectedWallet = item.wallet_address === address
      const isImpaWallet = item.wallet_client === 'impa'
      return isConnectedWallet || isImpaWallet
    })

    if (canActiveList.length) {
      const activedWallet = canActiveList.find((item) => item.is_active)
      if (!activedWallet) {
        activeWallet(canActiveList[0].wallet_address)
      }
    }
  }, [userAccount, address, activeWallet])

  const onLogout = async () => {
    await disconnectAsync()
    logout()
  }

  const getDisplayData = () => {
    return {
      did: userAccount?.did,
      wallets: userAccount?.wallets,
      socials: userAccount?.socials,
    }
  }

  return (
    <Flex
      flexDirection={isLargerThan900 ? 'row' : 'column'}
      padding={'16px'}
      gap={'32px'}
      alignSelf={'flex-start'}
    >
      <VStack
        spacing={'16px'}
        alignItems={'start'}
        w={isLargerThan900 ? '350px' : 'full'}
        order={isLargerThan900 ? 0 : 2}
      >
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
          {JSON.stringify(getDisplayData(), null, 2)}
        </Code>
        <Box
          padding={'16px'}
          borderColor={'border'}
          borderWidth={'1px'}
          borderRadius={'10px'}
          w={'full'}
        >
          <Text fontSize={'14px'} color={'second'}>
            Sign out or delete your data to restart the demo.
          </Text>
          <Flex gap={'16px'} mt={'16px'}>
            <Button
              variant="outline"
              fontSize={'12px'}
              h={'32px'}
              onClick={onLogout}
            >
              Sign Out
            </Button>
            <Button
              variant="outline"
              fontSize={'12px'}
              h={'32px'}
              color={'red.300'}
              onClick={deleteAccount}
            >
              Delete Account
            </Button>
          </Flex>
        </Box>
      </VStack>

      <Box
        w={isLargerThan900 ? '288px' : 'full'}
        order={isLargerThan900 ? 0 : 1}
      >
        <Box
          p="16px"
          bg={'dark.bg'}
          borderRadius={'10px'}
          color={'primary'}
          alignSelf={'flex-start'}
        >
          <Flex gap={'8px'} alignItems={'center'}>
            <Image width={'16px'} height={'16px'} src={walletImg} />
            <Text fontSize={'14px'}>Wallets</Text>
          </Flex>
          <Text fontSize={'12px'} color={'second'} mt={'8px'}>
            Connect and link wallets to your account.
          </Text>
          {userAccount?.wallets?.map((item) => {
            const isConnectedWallet = item.wallet_address === address
            const isImpaWallet = item.wallet_client === 'impa'
            return (
              <Button
                variant="outline"
                color="white"
                mt={'8px'}
                p="8px 16px"
                height={'40px'}
                w={'full'}
              >
                <Flex
                  w={'full'}
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  gap={'12px'}
                  onMouseEnter={() => {
                    setHoverWallet(item.wallet_address)
                  }}
                  onMouseLeave={() => {
                    setHoverWallet('')
                  }}
                >
                  {/* <Image width={'16px'} height={'16px'} src={icon} /> */}
                  <Text fontSize={'14px'} mr="auto" color={'primary'}>
                    {formatAddress(item.wallet_address)}
                  </Text>

                  {isActive(item) ? (
                    <Button
                      h={'22px'}
                      fontSize={'12px'}
                      bg={'brand'}
                      _hover={{ bg: 'brand' }}
                    >
                      Active
                    </Button>
                  ) : (
                    <Flex alignItems={'center'} gap={'4px'}>
                      {hoverWallet === item.wallet_address ? (
                        <Button
                          fontSize={'12px'}
                          h={'20px'}
                          px={'8px'}
                          onClick={() =>
                            isConnectedWallet || isImpaWallet
                              ? activeWallet(item.wallet_address)
                              : connectWallet()
                          }
                        >
                          {isConnectedWallet || isImpaWallet
                            ? 'Set Active'
                            : 'Connect'}
                        </Button>
                      ) : null}

                      {item.wallet_client === 'impa' ? null : (
                        <Image
                          src={unlinkImg}
                          cursor={
                            unlinkWalletDisable ? 'not-allowed' : 'pointer'
                          }
                          w={'16px'}
                          h={'16px'}
                          onClick={() => onUnlinkWallet(item.wallet_address)}
                        />
                      )}
                    </Flex>
                  )}
                </Flex>
              </Button>
            )
          })}
          <Button
            fontSize={'14px'}
            variant={'outline'}
            w={'full'}
            mt={'8px'}
            onClick={linkWallet}
          >
            + Link a Wallet
          </Button>
        </Box>

        <Box
          p="16px"
          bg={'dark.bg'}
          borderRadius={'10px'}
          color={'primary'}
          alignSelf={'flex-start'}
          mt={'32px'}
        >
          <Flex gap={'8px'} alignItems={'center'}>
            <Image width={'16px'} height={'16px'} src={actionImg} />
            <Text fontSize={'14px'}>Wallet Actions</Text>
          </Flex>
          <Text fontSize={'12px'} color={'second'} mt={'8px'}>
            Whether they came in with Metamask or an embedded wallet, a user is
            a user. Trigger wallet actions below.
          </Text>
          <Button
            fontSize={'14px'}
            variant={'outline'}
            w={'full'}
            mt={'8px'}
            onClick={onSignMessage}
          >
            <Image width={'16px'} height={'16px'} mr={'6px'} src={editImg} />
            Sign a Message
          </Button>

          {signStatus === SIGN_STATUS.INIT ? null : (
            <Box
              bg={'dark.lightBg'}
              fontSize={'14px'}
              py={'6px'}
              px={'16px'}
              mt={'16px'}
              borderRadius={'6px'}
            >
              {[SIGN_STATUS.FAILED, SIGN_STATUS.SUCCESS].includes(
                signStatus
              ) ? (
                <Flex justifyContent={'space-between'}>
                  {signStatus === SIGN_STATUS.FAILED ? (
                    <Text color={'red.300'}>Signature failed</Text>
                  ) : (
                    <Text color={'green.300'}>Success!</Text>
                  )}
                  <Text
                    cursor={'pointer'}
                    onClick={() => setSignStatus(SIGN_STATUS.INIT)}
                  >
                    Dissmiss
                  </Text>
                </Flex>
              ) : null}

              {signStatus === SIGN_STATUS.SIGNING ? (
                <Flex>
                  <Text>Waiting for signature...</Text>
                </Flex>
              ) : null}
            </Box>
          )}
        </Box>

        {embeddedWallet ? (
          <Box
            p="16px"
            bg={'dark.bg'}
            borderRadius={'10px'}
            color={'primary'}
            alignSelf={'flex-start'}
            mt={'32px'}
          >
            <Flex
              gap={'8px'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Image width={'16px'} height={'16px'} src={lockImg} />
              <Text fontSize={'14px'} flex={1}>
                Embedded Wallet
              </Text>
              <Text fontSize={'14px'} color={'second'}>
                {formatAddress(embeddedWallet?.wallet_address)}
              </Text>
            </Flex>
            <Text fontSize={'12px'} color={'second'} mt={'8px'}>
              A user's embedded wallet is theirs to keep, and even take with
              them.
            </Text>
            <Button
              fontSize={'14px'}
              variant={'outline'}
              w={'full'}
              mt={'8px'}
              onClick={exportWallet}
            >
              Export Embedded wallet
            </Button>
          </Box>
        ) : null}
      </Box>

      <Box
        w={isLargerThan900 ? '288px' : 'full'}
        p="16px"
        bg={'dark.bg'}
        borderRadius={'10px'}
        color={'primary'}
        alignSelf={'flex-start'}
      >
        <Flex gap={'8px'} alignItems={'center'}>
          <Image width={'16px'} height={'16px'} src={socialImg} />
          <Text fontSize={'14px'}>Linked Socials</Text>
        </Flex>

        <Button
          variant="outline"
          color="white"
          mt={'8px'}
          p="8px 16px"
          height={'40px'}
          borderWidth={'1px'}
          borderRadius={'8px'}
          w={'full'}
        >
          <Flex
            w={'full'}
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            gap={'12px'}
          >
            <Image width={'16px'} height={'16px'} src={googleImg} />
            <Text fontSize={'14px'} mr="auto" color={'primary'}>
              Google
            </Text>

            <Text fontSize={'12px'} color={'second'}>
              {googleObj?.social_username}
            </Text>

            <Image
              src={googleObj ? unlinkImg : linkImg}
              cursor={'pointer'}
              onClick={onGoogle}
              w={'16px'}
              h={'16px'}
            />
          </Flex>
        </Button>
      </Box>

      {isSignMessageOpen ? (
        <SignMessageModal
          onClose={() => setIsSignMessageOpen(false)}
          onSuccess={onSignMessageSuccess}
          onFailed={onSignMessageFailed}
        />
      ) : null}
    </Flex>
  )
}
