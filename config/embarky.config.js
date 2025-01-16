import { bsc, mainnet } from 'viem/chains'

const config = {
  appId: 'be78b498915f03b98bec',
  theme: 'dark',
  appName: 'Embarky Demo',
  supportedChains: [bsc, mainnet],
  defaultChain: bsc,
  allowMethods: ['farcaster', 'twitter', 'google'],
  allowWallets: [
    'Sui Wallet',
    'Suiet',
    'metaMask',
    'tomo',
    'coinbase',
    'aptos-petra',
    'aptos-nightly',
    'solana-phantom',
  ],
  farcaster: {
    rpcUrl: 'https://optimism-rpc.publicnode.com',
  },
}

export default config
