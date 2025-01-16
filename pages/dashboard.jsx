import React, { useState, useEffect, useRef } from 'react'
import {
  Button,
  Code,
  Box,
  Flex,
  Text,
  VStack,
  useMediaQuery,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverCloseButton,
  CircularProgress,
  Portal,
  Modal,
  ModalCloseButton,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@chakra-ui/react'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi' // eslint-disable-line
import {
  useEmbarky,
  getSignMessage,
  useFarcaster,
  QRCode,
  useEmbarkySignMessage,
} from '@embarky/react'
import { getMoonPayUrl } from '@embarky/core-sdk'
import Image from '@/components/Image'
import { formatAddress } from '@/utils'
import googleImg from '@/images/social/google.svg'
import twitterImg from '@/images/social/twitter.svg'
import walletImg from '@/images/icon/wallet.svg'
import socialImg from '@/images/icon/social.svg'
import linkImg from '@/images/icon/link.svg'
import unlinkImg from '@/images/icon/unlink.svg'
import actionImg from '@/images/icon/action.svg'
import lockImg from '@/images/icon/lock.svg'
import editImg from '@/images/icon/edit.svg'
import SignMessageModal from '@/components/SignMessageModal'
import { getWalletIcon } from '@/images/index'
import AptosTx from '@/components/aptosTx'
import SolanaTx from '@/components/SolanaTx'

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
    linkTwitter,
    unlinkTwitter,
    unlinkGoogle,
    activeWallet,
    connectWallet,
    exportWallet,
    linkFarcaster,
    unlinkFarcaster,
    linkGoogleRedirect,
    linkTwitterRedirect,
  } = useEmbarky()
  const { address, connector } = useAccount()
  const [isSignMessageOpen, setIsSignMessageOpen] = useState(false)
  const [signStatus, setSignStatus] = useState(SIGN_STATUS.INIT)
  const [hoverWallet, setHoverWallet] = useState('')
  const { disconnectAsync } = useDisconnect()
  const toast = useToast()
  const { data: farcasterData, onSignin, onSignout, qrCodeUrl } = useFarcaster()
  const [isLargerThan900] = useMediaQuery('(min-width: 900px)')
  const { signMessage } = useEmbarkySignMessage()

  useEffect(() => {
    if (farcasterData?.state === 'completed') {
      // console.log('farcasterData?.status', farcasterData?.state)
      onLinkFarcaster(farcasterData)
    }
  }, [farcasterData])

  const [loadingFarcaster, setLoadingFarcaster] = useState(false)
  const googleObj = userAccount?.socials?.find(
    (item) => item.social_type === 'google'
  )
  const twitterObj = userAccount?.socials?.find(
    (item) => item.social_type === 'twitter'
  )
  const farcasterObj = userAccount?.socials?.find(
    (item) => item.social_type === 'warpcast'
  )

  const embeddedWallet = userAccount?.wallets?.find(
    (item) => item.wallet_client === 'embarky'
  )

  const isActive = (wallet) => {
    if (!wallet) return false
    const isConnectedWallet = wallet.wallet_address === address
    const isImpaWallet = wallet.wallet_client === 'embarky'
    return wallet.is_active && (isConnectedWallet || isImpaWallet)
  }

  const unlinkWalletDisable = userAccount?.wallets?.length === 1

  // jacky: add try catch to handle unlink google error
  const onGoogle = async () => {
    if (googleObj) {
      try {
        const res = await unlinkGoogle(googleObj.social_subject)
        console.log('res', res)
      } catch (e) {
        toast({
          title: JSON.parse(e?.message)?.data,
          status: 'error',
          position: 'top',
        })
      }
    } else {
      try {
        linkGoogleRedirect()
        // await linkGoogle()
      } catch (e) {
        toast({
          title: JSON.parse(e?.message)?.data,
          status: 'error',
          position: 'top',
        })
      }
    }
  }
  const onUnlineTwitter = async () => {
    try {
      const res = await unlinkTwitter(twitterObj.social_subject)
      console.log('res', res)
    } catch (e) {
      toast({
        title: JSON.parse(e?.message)?.data,
        status: 'error',
        position: 'top',
      })
    }
  }
  const onLinkTwitter = async () => {
    try {
      linkTwitterRedirect()

      // const res = await linkTwitter()
      // console.log('res', res)
    } catch (e) {
      console.log('e')
      toast({
        title: e?.message,
        status: 'error',
        position: 'top',
      })
    }
  }

  const onUnlinkFarcaster = async () => {
    try {
      const res = await unlinkFarcaster(farcasterObj.social_subject)
      // console.log('onUnlinkFarcaster res', res)
      onSignout()
    } catch (e) {
      toast({
        title: JSON.parse(e?.message)?.data,
        status: 'error',
        position: 'top',
      })
    }
  }
  const onLinkFarcaster = async (data) => {
    try {
      // console.log('onUnlinkFarcaster', data)
      setLoadingFarcaster(true)
      const res = await linkFarcaster(data)
      // console.log('res', res)
    } catch (e) {
      console.log('e')
      toast({
        title: e?.message,
        status: 'error',
        position: 'top',
      })
    } finally {
      setLoadingFarcaster(false)
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

    if (activedWallet?.wallet_client === 'embarky') {
      setIsSignMessageOpen(true)
    } else {
      setSignStatus(SIGN_STATUS.SIGNING)
      try {
        const message = await getSignMessage(address)
        const res = await signMessage(message)
        if (res) {
          setSignStatus(SIGN_STATUS.SUCCESS)
        } else {
          setSignStatus(SIGN_STATUS.FAILED)
        }
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
      const isImpaWallet = item.wallet_client === 'embarky'
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
    await disconnectAsync().catch(() => console.log('e'))
    logout()
  }

  const getDisplayData = () => {
    return {
      did: userAccount?.did,
      wallets: userAccount?.wallets,
      socials: userAccount?.socials,
    }
  }
  const initRef = useRef()

  const [isOpenSolanaTxModal, setOpenSolanaTxModal] = useState(false)
  const [isOpenAptosModal, setOpenAptosModal] = useState(false)

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
          bg={'dark.bg'}
        >
          {JSON.stringify(getDisplayData(), null, 2)}
        </Code>
        <Box
          padding={'16px'}
          borderColor={'border'}
          borderWidth={'1px'}
          borderRadius={'10px'}
          w={'full'}
          bg={'dark.bg'}
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
            const isImpaWallet = item.wallet_client === 'embarky'
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
                  <img
                    alt=""
                    style={{
                      width: '16px',
                      height: '16px',
                    }}
                    src={getWalletIcon(item.wallet_client)}
                  />
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

                      {item.wallet_client === 'embarky' ? null : (
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
              {
                "A user's embedded wallet is theirs to keep, and even take with them."
              }
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

            <Text fontSize={'12px'} color={'primary'}>
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
            <Image
              width={'16px'}
              height={'16px'}
              src={twitterImg}
              style={{
                filter: 'brightness(0.2)',
              }}
            />
            <Text fontSize={'14px'} mr="auto" color={'primary'}>
              Twitter
            </Text>

            <Text fontSize={'12px'} color={'primary'}>
              {twitterObj?.social_username}
            </Text>

            <Image
              src={twitterObj ? unlinkImg : linkImg}
              cursor={'pointer'}
              onClick={() => (twitterObj ? onUnlineTwitter() : onLinkTwitter())}
              w={'16px'}
              h={'16px'}
            />
          </Flex>
        </Button>
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
            <img
              src="https://embarky-static-public.s3.ap-southeast-1.amazonaws.com/imgs/farcaster-logo.svg"
              style={{
                width: '16px',
              }}
            />
            <Text fontSize={'14px'} mr="auto" color={'primary'}>
              Farcaster
            </Text>

            <Text fontSize={'12px'} color={'primary'}>
              {farcasterObj?.social_username}
            </Text>

            {farcasterObj ? (
              <Image
                src={unlinkImg}
                cursor={'pointer'}
                onClick={onUnlinkFarcaster}
                w={'16px'}
                h={'16px'}
              />
            ) : (
              <Popover
                styleConfig={{
                  width: '220px',
                }}
                closeOnBlur={false}
                placement="bottom"
                initialFocusRef={initRef}
              >
                <>
                  <PopoverTrigger>
                    <Image
                      src={linkImg}
                      cursor={'pointer'}
                      onClick={() => {
                        onSignin()
                      }}
                      w={'16px'}
                      h={'16px'}
                    />
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent
                      bg={'var(--chakra-colors-dark-bg)'}
                      padding={'20px'}
                      position={'relative'}
                      borderRadius={8}
                      border={'1px solid var(--chakra-colors-border)'}
                    >
                      <PopoverCloseButton
                        position={'absolute'}
                        top={'10px'}
                        right={'10px'}
                        cursor={'pointer'}
                      />
                      <PopoverBody
                        padding={'20px 0'}
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                      >
                        <div
                          style={{
                            position: 'relative',
                          }}
                        >
                          {qrCodeUrl && (
                            <QRCode
                              uri={qrCodeUrl}
                              size={180}
                              logoSize={22}
                              logoMargin={12}
                            />
                          )}
                          {loadingFarcaster ? (
                            <CircularProgress
                              isIndeterminate
                              value={50}
                              color="brand"
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                              }}
                            />
                          ) : null}
                        </div>
                        <Box fontSize={14} mt="8px">
                          {"Scan with your phone's camera to continue."}
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </>
              </Popover>
            )}
          </Flex>
        </Button>
      </Box>
      <Box
        w={isLargerThan900 ? '288px' : 'full'}
        p="16px"
        bg={'dark.bg'}
        borderRadius={'10px'}
        color={'primary'}
        alignSelf={'flex-start'}
      >
        <Text fontSize={'14px'}>Utils</Text>
        <Box
          height={'36px'}
          width={'100%'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          borderWidth={'1px'}
          borderColor={'#767BFF'}
          color="primary"
          borderRadius={'10px'}
          fontWeight={600}
          mt="8px"
          fontSize={'14px'}
          cursor={'pointer'}
          onClick={async () => {
            const activedWallet = (userAccount?.wallets || []).find((item) =>
              isActive(item)
            )
            const url = await getMoonPayUrl({
              wallet_address: activedWallet.wallet_address,
              currency_code: 'eth',
              redirect_url: 'https://demo.embarky.xyz',
            })
            console.log('url', url)
            if (url) {
              window.open(url)
            }
          }}
        >
          Moon Pay
        </Box>
        {connector?.type.includes('solana') ? (
          <Box
            height={'36px'}
            width={'100%'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            borderWidth={'1px'}
            borderColor={'border'}
            background={'#fff'}
            color="white"
            bg="brand"
            borderRadius={'10px'}
            fontWeight={500}
            mt="8px"
            fontSize={'14px'}
            cursor={'pointer'}
            onClick={() => {
              setOpenSolanaTxModal(true)
            }}
          >
            Solana hooks
          </Box>
        ) : null}
        {connector?.type.includes('aptos') ? (
          <Box
            height={'36px'}
            width={'100%'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            borderWidth={'1px'}
            borderColor={'border'}
            background={'#fff'}
            color="white"
            bg="brand"
            borderRadius={'10px'}
            fontWeight={500}
            mt="8px"
            fontSize={'14px'}
            cursor={'pointer'}
            onClick={() => {
              setOpenAptosModal(true)
            }}
          >
            Aptos hooks
          </Box>
        ) : null}
      </Box>
      <Modal
        size={'3xl'}
        isOpen={isOpenSolanaTxModal}
        onClose={() => {
          setOpenSolanaTxModal(false)
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={'#000'}>
            Solana Hooks
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody color="#000">
            <SolanaTx />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenAptosModal}
        onClose={() => {
          setOpenAptosModal(false)
        }}
        size={'3xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={'#000'}>
            Aptos Hooks
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody color="#000">
            <AptosTx />
          </ModalBody>
        </ModalContent>
      </Modal>
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
