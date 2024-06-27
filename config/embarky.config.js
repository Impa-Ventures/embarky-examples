import { bsc, mainnet } from 'viem/chains'

const config = {
  appId: 'be78b498915f03b98bec',
  Origin: 'https://demo.embarky.xyz',
  theme: 'light',
  defaultChain: bsc,
  supportedChains: [bsc, mainnet],
  appLogo: '', // optional, size: 165px * 34px
  allowMethods: ['farcaster', 'twitter', 'google'],
  allowWallets: ['metaMask', 'tomo'],
  farcaster: {
    rpcUrl: 'https://optimism-rpc.publicnode.com',
    // domain: 'embarky.com',
    // siweUri: 'https://embarky.com/login',
  },
}

export default config
