import { createContext, ReactNode, useContext, useMemo, useState } from 'react'

export type AllowNetworks = 'evm' | 'aptos' | 'solana'
export type AllowMethods = 'google' | 'twitter' | 'farcaster'
const ConfigContext = createContext<{
  selectedwalletNetworks: AllowNetworks[]
  selectedSocialMethods: AllowMethods[]
  // @ts-ignore
  onChangeWalletNetworks: ((data: AllowNetworks[]) => void) | null
  // @ts-ignore
  onChangeSocialMethods: ((data: AllowMethods[]) => void) | null
}>({
  selectedwalletNetworks: ['evm', 'aptos', 'solana'],
  selectedSocialMethods: ['google', 'twitter', 'farcaster'],
  onChangeWalletNetworks: null,
  onChangeSocialMethods: null,
})

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [selectedwalletNetworks, setSelectedWalletNetworks] = useState<
    AllowNetworks[]
  >(['evm', 'aptos', 'solana'])
  const [selectedSocialMethods, setSelectedSocialMethods] = useState<
    AllowMethods[]
  >(['google', 'twitter', 'farcaster'])

  const value = useMemo(
    () => ({
      selectedwalletNetworks,
      onChangeWalletNetworks: (data: AllowNetworks[]) =>
        setSelectedWalletNetworks(data),
      selectedSocialMethods,
      onChangeSocialMethods: (data: AllowMethods[]) =>
        setSelectedSocialMethods(data),
    }),
    [
      selectedwalletNetworks,
      setSelectedWalletNetworks,
      selectedSocialMethods,
      setSelectedSocialMethods,
    ]
  )
  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  )
}

export function useConfig() {
  return useContext(ConfigContext)
}
