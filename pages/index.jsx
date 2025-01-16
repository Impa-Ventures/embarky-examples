import { useEmbarky, LoginModal } from '@embarky/react'
import {
  Flex,
  VStack,
  Button,
  Box,
  Input,
  Switch,
  Checkbox,
  useMediaQuery,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react'
import Image from 'next/image'
import { useDisconnect } from 'wagmi'
import { useMemo, useState } from 'react'
import copy from 'copy-to-clipboard'
import embarkyConfig from '../config/embarky.config'
import { useConfig } from '@/components/ConfigProvider'
import {
  IconGoogle,
  IconFarcaster,
  Icontwitter,
  IconSolana,
} from '@/images/index'
import iconEdit from '@/images/icon/edit.svg'
import iconSocial from '@/images/icon/social.svg'

function Card({ title, titleIcon, children, desc, isGradientBorder }) {
  return (
    <Box
      boxShadow={'0px 0px 3px rgba(0,0,0,0.2)'}
      borderRadius={'16px'}
      width={'300px'}
      overflow={'hidden'}
      position={'relative'}
      padding={'2px'}
      backgroundImage={
        isGradientBorder
          ? 'linear-gradient(to right, #d76363, #6363cd)'
          : 'none'
      }
    >
      <Flex
        gap="8px"
        padding="14px"
        borderRadius={'inherit'}
        flexDirection={'column'}
        background={'dark.bg'}
      >
        <Flex
          alignItems={'center'}
          gap={'4px'}
          fontSize={'14px'}
          fontWeight={'600'}
          color="#fff"
        >
          {titleIcon && <Image src={titleIcon} alt="" width={14} height={14} />}
          {title}
        </Flex>
        {desc ? (
          <Box fontSize={'12px'} fontWeight={400} color="#7d7d7d">
            {desc}
          </Box>
        ) : null}
        <Box>{children}</Box>
      </Flex>
    </Box>
  )
}
function ButtonSmall({ onClick, children }) {
  return (
    <Box
      border={'1px solid #ededed'}
      padding="4px 8px"
      width={'fit-content'}
      borderRadius={'6px'}
      color="#fff"
      fontSize={'14px'}
      cursor={'pointer'}
      onClick={onClick}
    >
      {children}
    </Box>
  )
}

export default function Home() {
  const { authenticated, logout, linkWallet, linkGoogle, getEmbeddedWallet } =
    useEmbarky()

  const [isPC] = useMediaQuery('(min-width: 900px)')

  const { disconnectAsync } = useDisconnect()
  const getWallet = () => {
    getEmbeddedWallet().then((wallet) => {
      console.log(wallet)
    })
  }
  const [logoUrl, setLogoUrl] = useState()
  const [isSelectedWallet, setisSelectedWallet] = useState(true)
  const [isSelectedSocial, setisSelectedSocial] = useState(true)

  const socialMethods = [
    {
      icon: IconGoogle,
      text: 'Google',
    },
    {
      icon: Icontwitter,
      text: 'Twitter',
    },
    {
      icon: IconFarcaster,
      text: 'Farcaster',
    },
  ]
  const {
    selectedSocialMethods,
    selectedwalletNetworks,
    onChangeWalletNetworks,
    onChangeSocialMethods,
  } = useConfig()
  const wallets = useMemo(() => {
    const list = []
    if (selectedwalletNetworks.includes('evm')) {
      list.push('metaMask', 'tomo', 'coinbase')
    }
    if (selectedwalletNetworks.includes('aptos')) {
      list.push('aptos-petra', 'aptos-nightly')
    }
    if (selectedwalletNetworks.includes('solana')) {
      list.push('solana-phantom')
    }
    return list
  }, [selectedwalletNetworks])
  const walletNetworks = [
    {
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUzNSIgaGVpZ2h0PSIyNTAwIiB2aWV3Qm94PSIwIDAgMjU2IDQxNyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+Cgk8cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTI3Ljk2MSAwbC0yLjc5NSA5LjV2Mjc1LjY2OGwyLjc5NSAyLjc5IDEyNy45NjItNzUuNjM4eiIvPgoJPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyNy45NjIgMEwwIDIxMi4zMmwxMjcuOTYyIDc1LjYzOVYxNTQuMTU4eiIvPgoJPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyNy45NjEgMzEyLjE4N2wtMS41NzUgMS45MnY5OC4xOTlsMS41NzUgNC42TDI1NiAyMzYuNTg3eiIvPgoJPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyNy45NjIgNDE2LjkwNXYtMTA0LjcyTDAgMjM2LjU4NXoiLz4KCTxwYXRoIGZpbGw9IiNlZWUiIGQ9Ik0xMjcuOTYxIDI4Ny45NThsMTI3Ljk2LTc1LjYzNy0xMjcuOTYtNTguMTYyeiIvPgoJPHBhdGggZmlsbD0iI2JiYiIgZD0iTTAgMjEyLjMybDEyNy45NiA3NS42Mzh2LTEzMy44eiIvPgo8L3N2Zz4=',
      text: 'EVM',
    },
    {
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjUiIHZpZXdCb3g9IjAgMCA2NCA2NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQ5LjU2NzggMjIuNTEzN0g0My45MDU2QzQzLjI0NzEgMjIuNTEzNyA0Mi42MTg5IDIyLjI1MTYgNDIuMTgwOCAyMS43OTYxTDM5Ljg4NTcgMTkuNDAxN0MzOS41NDQgMTkuMDQ1NSAzOS4wNTA4IDE4LjgzOTQgMzguNTM1NiAxOC44Mzk0QzM4LjAyMDMgMTguODM5NCAzNy41MjcxIDE5LjA0MjkgMzcuMTg1NSAxOS40MDE3TDM1LjIxNTQgMjEuNDU3N0MzNC41NzA3IDIyLjEyOTQgMzMuNjQ0OSAyMi41MTYyIDMyLjY3MjMgMjIuNTE2MkgxLjY4NjI0QzAuODA0NTQ1IDI0LjgzOTQgMC4yMjg2ODkgMjcuMjkyMyAwIDI5LjgzOTRIMjkuMjUzQzI5Ljc2ODIgMjkuODM5NCAzMC4yNTg2IDI5LjY0NiAzMC42MTQxIDI5LjMwMjVMMzMuMzM5MSAyNi42NzlDMzMuNjc4IDI2LjM1MDggMzQuMTQ5MSAyNi4xNjUxIDM0LjYzOTYgMjYuMTY1MUgzNC43NTI1QzM1LjI2NzggMjYuMTY1MSAzNS43NjEgMjYuMzY4NiAzNi4xMDI2IDI2LjcyNzRMMzguMzk3OCAyOS4xMjE4QzM4LjgzNTkgMjkuNTc3MyAzOS40NjEzIDI5LjgzOTQgNDAuMTIyNiAyOS44Mzk0SDY0QzYzLjc3MTMgMjcuMjkyMyA2My4xOTU0IDI0LjgzOTQgNjIuMzEzNyAyMi41MTYySDQ5LjU2NzhWMjIuNTEzN1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNy45NTYxIDQ2LjgzNjZDMTguNDYyMiA0Ni44MzY2IDE4Ljk0NCA0Ni42MjcgMTkuMjkzMSA0Ni4yNTQ3TDIxLjk2OTggNDMuNDExMkMyMi4zMDI3IDQzLjA1NTQgMjIuNzY1NSA0Mi44NTQxIDIzLjI0NzMgNDIuODU0MUgyMy4zNTgyQzIzLjg2NDMgNDIuODU0MSAyNC4zNDg4IDQzLjA3NDcgMjQuNjg0NCA0My40NjM2TDI2LjkzODkgNDYuMDU4OEMyNy4zNjkyIDQ2LjU1MjUgMjcuOTgzNiA0Ni44MzY2IDI4LjYzMzIgNDYuODM2Nkg2MC40MThDNjEuNjA4OSA0NC4zMjk2IDYyLjQ4MDQgNDEuNjM3OCA2MyAzOC44MjE5SDMyLjQ5MjZDMzEuODQ1NyAzOC44MjE5IDMxLjIyODcgMzguNTM3OCAzMC43OTgzIDM4LjA0NDFMMjguNTQzOCAzNS40NDg5QzI4LjIwODIgMzUuMDYyOCAyNy43MjM4IDM0LjgzOTQgMjcuMjE3NyAzNC44Mzk0QzI2LjcxMTUgMzQuODM5NCAyNi4yMjcxIDM1LjA2IDI1Ljg5MTUgMzUuNDQ4OUwyMy45NTYzIDM3LjY3NzNDMjMuMzIzIDM4LjQwNTQgMjIuNDEzNyAzOC44MjQ2IDIxLjQ1ODMgMzguODI0NkgxQzEuNTE5NjQgNDEuNjQzMyAyLjM5MTE0IDQ0LjMzMjMgMy41ODE5OSA0Ni44Mzk0SDE3Ljk1NjFWNDYuODM2NloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik00MC4wOTY3IDEzLjgzOTRDNDAuNjA4MyAxMy44Mzk0IDQxLjA5NTMgMTMuNjI3MiA0MS40NDgzIDEzLjI1MDJMNDQuMTU0MiAxMC4zNzE2QzQ0LjQ5MDggMTAuMDExNCA0NC45NTg2IDkuODA3NTcgNDUuNDQ1NyA5LjgwNzU3SDQ1LjU1NzhDNDYuMDY5NSA5LjgwNzU3IDQ2LjU1OTIgMTAuMDMwOSA0Ni44OTg1IDEwLjQyNDZMNDkuMTc3NiAxMy4wNTJDNDkuNjEyNyAxMy41NTE4IDUwLjIzMzggMTMuODM5NCA1MC44OTA0IDEzLjgzOTRINTdDNTEuMTgwNCA1Ljk0NjEgNDEuOTI0NCAwLjgzOTM1NSAzMS41IDAuODM5MzU1QzIxLjA3NTcgMC44MzkzNTUgMTEuODE5NiA1Ljk0NjEgNiAxMy44Mzk0SDQwLjA5OTRINDAuMDk2N1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNy43OTY2IDU0Ljc2MzNIMTkuMzc1QzE4LjcxNTkgNTQuNzYzMyAxOC4wODcyIDU0LjQ4MzQgMTcuNjQ4NyA1My45OTdMMTUuMzUxNyA1MS40Mzk5QzE1LjAwOTcgNTEuMDU5NSAxNC41MTYxIDUwLjgzOTQgMTQuMDAwNSA1MC44Mzk0QzEzLjQ4NDggNTAuODM5NCAxMi45OTEyIDUxLjA1NjcgMTIuNjQ5MyA1MS40Mzk5TDEwLjY3NzYgNTMuNjM1NkMxMC4wMzIzIDU0LjM1MjkgOS4xMDU4IDU0Ljc2NiA4LjEzMjM3IDU0Ljc2Nkg4QzEzLjg2ODEgNjAuOTYxNiAyMi4yMjA4IDY0LjgzOTQgMzEuNSA2NC44Mzk0QzQwLjc3OTIgNjQuODM5NCA0OS4xMzE5IDYwLjk2MTYgNTUgNTQuNzY2SDI3Ljc5NjZWNTQuNzYzM1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==',
      text: 'Aptos',
    },
    {
      icon: IconSolana,
      text: 'Solana',
    },
  ]

  const [isShowDrawer, setShowDrawer] = useState(false)
  if (!authenticated) {
    return (
      <>
        <Flex gap="30px" flexDirection={isPC ? 'row' : 'column'} h="100%">
          <Box
            width={isPC ? '383px' : '100%'}
            padding="24px 16px"
            borderRadius="16px"
            borderTopRightRadius="0"
            borderBottomRightRadius="0"
            borderTop="0"
            borderLeft="0"
            border="1px solid #767BFF"
            background="dark.bg"
          >
            <Flex
              className="title"
              alignItems={'center'}
              fontSize="16px"
              fontFamily="800"
              gap="4px"
              marginBottom={'8px'}
            >
              <img src={iconEdit.src} alt="" height="14px" width={'14px'} />
              Customize
            </Flex>
            <Input
              placeholder="Add Image URL"
              value={logoUrl}
              size={'sm'}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
            <Flex
              className="title"
              fontSize="16px"
              fontFamily="800"
              marginTop={'24px'}
              borderBottom={'1px solid #e1e1e1'}
              paddingBottom={'8px'}
              alignItems={'center'}
              gap="4px"
            >
              <img src={iconSocial.src} alt="" height="14px" width={'14px'} />
              Authentication
            </Flex>
            <Flex
              justifyContent={'space-between'}
              alignItems={'center'}
              height="40px"
            >
              Wallets
              <Switch
                size="sm"
                isChecked={isSelectedWallet}
                onChange={(e) => {
                  const flag = e.target.checked
                  if (!flag && !isSelectedSocial) return
                  setisSelectedWallet(flag)
                  if (!flag) {
                    onChangeWalletNetworks([])
                  }
                }}
              />
            </Flex>
            <Flex gap="8px" flexWrap={'wrap'}>
              {walletNetworks.map((item, index) => {
                return (
                  <Checkbox
                    isDisabled={!isSelectedWallet}
                    style={{
                      border: '1px solid #767BFF',
                      borderRadius: '6px',
                      display: 'flex',
                      flexWrap: 'nowrap',
                      width: '48.5%',
                      padding: '8px',
                    }}
                    key={index}
                    size="md"
                    isChecked={selectedwalletNetworks.includes(
                      item.text.toLowerCase()
                    )}
                    onChange={(e) => {
                      const value = e.target.checked
                      if (value) {
                        if (selectedwalletNetworks.includes(item.text)) return
                        onChangeWalletNetworks([
                          item.text.toLowerCase(),
                          ...selectedwalletNetworks,
                        ])
                      } else {
                        if (
                          selectedwalletNetworks.length <= 1 &&
                          !isSelectedSocial
                        ) {
                          return
                        }
                        onChangeWalletNetworks([
                          ...selectedwalletNetworks.filter(
                            (a) => a !== item.text.toLowerCase()
                          ),
                        ])
                      }
                    }}
                  >
                    <Flex
                      alignItems={'center'}
                      color="primary"
                      gap="4px"
                      fontSize={'14px'}
                    >
                      <img
                        style={{
                          height: '16px',
                          width: '16px',
                        }}
                        alt={item.text}
                        src={item.icon}
                      />
                      {item.text}
                    </Flex>
                  </Checkbox>
                )
              })}
            </Flex>
            <Flex
              justifyContent={'space-between'}
              alignItems={'center'}
              height="40px"
            >
              Social
              <Switch
                size="sm"
                isChecked={isSelectedSocial}
                isDisabled={!isSelectedSocial && !isSelectedWallet}
                onChange={(e) => {
                  const flag = e.target.checked
                  setisSelectedSocial(flag)
                  if (!flag) {
                    onChangeSocialMethods([])
                  }
                }}
              />
            </Flex>
            <Flex gap="8px" flexWrap={'wrap'}>
              {socialMethods.map((item, index) => {
                return (
                  <Checkbox
                    isDisabled={!isSelectedSocial}
                    style={{
                      border: '1px solid #767BFF',
                      borderRadius: '6px',
                      display: 'flex',
                      flexWrap: 'nowrap',
                      width: '48.5%',
                      padding: '8px',
                    }}
                    key={index}
                    size="md"
                    isChecked={selectedSocialMethods.includes(
                      item.text.toLowerCase()
                    )}
                    onChange={(e) => {
                      const value = e.target.checked
                      if (value) {
                        if (selectedSocialMethods.includes(item.text)) return
                        onChangeSocialMethods([
                          item.text.toLowerCase(),
                          ...selectedSocialMethods,
                        ])
                      } else {
                        if (
                          selectedSocialMethods.length <= 1 &&
                          !isSelectedWallet
                        ) {
                          return
                        }
                        onChangeSocialMethods([
                          ...selectedSocialMethods.filter(
                            (a) => a !== item.text.toLowerCase()
                          ),
                        ])
                      }
                    }}
                  >
                    <Flex
                      alignItems={'center'}
                      color="primary"
                      gap="4px"
                      fontSize={'14px'}
                    >
                      <img
                        style={{
                          height: '16px',
                          width: '16px',
                        }}
                        alt={item.text}
                        src={item.icon}
                      />
                      {item.text}
                    </Flex>
                  </Checkbox>
                )
              })}
            </Flex>
          </Box>
          {isPC ? (
            <>
              <Box paddingTop={'32px'}>
                <LoginModal
                  appLogo={logoUrl || undefined}
                  theme={embarkyConfig.theme}
                  allowMethods={selectedSocialMethods}
                  allowWallets={wallets}
                  onClose={() => {}}
                />
              </Box>
              <Flex paddingTop={'32px'} flexDirection={'column'} gap={'24px'}>
                <Card
                  title="Explore Embarky"
                  isGradientBorder
                  titleIcon={''}
                  desc="The easiest way to onboard all of your users to web3"
                >
                  <Box fontSize={'14px'} color={'#fff'} mb="8px">
                    Sign in to the demo to access the dev tools.
                  </Box>
                  <ButtonSmall
                    onClick={() => {
                      window.open('https://embarky.gitbook.io/embarky')
                    }}
                  >
                    Explore the Docs
                  </ButtonSmall>
                </Card>
                <Card
                  title="Export this configuration"
                  titleIcon={''}
                  desc="Embarky's components can be customized client-side, so you can easily reuse this theme in your application."
                >
                  <ButtonSmall
                    onClick={() => {
                      const config = `
  <EmbarkyProvider 
    config={{
      appId: '<YOUR_EMBARKY_APP_ID',
      appLogo: '${logoUrl ?? ''}',
      allowWallets:  ${JSON.stringify(wallets)},
      allowMethods: ${JSON.stringify(selectedSocialMethods)}            
    }}>
    {children}
  </EmbarkyProvider>
  `
                      copy(config)
                    }}
                  >
                    Copy to Clipboard
                  </ButtonSmall>
                </Card>
              </Flex>
            </>
          ) : (
            <Flex
              position={'fixed'}
              bottom="10px"
              left="0"
              width={'100vw'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Button
                boxShadow={'0px 1px 9px 4px rgba(0, 0, 0, 0.2)'}
                onClick={() => setShowDrawer(true)}
                width={'80%'}
                height="7vh"
              >
                Login
              </Button>
            </Flex>
          )}
        </Flex>
        <Drawer
          isOpen={isShowDrawer}
          onClose={() => setShowDrawer(false)}
          placement="bottom"
        >
          <DrawerOverlay />
          <DrawerContent background={'none'}>
            <LoginModal
              appLogo={logoUrl || undefined}
              theme={embarkyConfig.theme}
              allowMethods={selectedSocialMethods}
              allowWallets={wallets}
              onClose={() => {
                setShowDrawer(false)
              }}
            />
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <VStack>
      <Flex gap={'16px'} my={'32px'}>
        <Button
          onClick={async () => {
            await disconnectAsync().catch((e) => console.log('e', e))
            logout()
          }}
        >
          logout
        </Button>
        <Button onClick={linkWallet}>linkWallet</Button>
        <Button onClick={linkGoogle}>linkGoogle</Button>
        <Button onClick={getWallet}>getEmbeddedWallet</Button>
      </Flex>
    </VStack>
  )
}
