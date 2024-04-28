import { bsc, mainnet } from 'viem/chains'

const config = {
  appId: 'be78b498915f03b98bec',
  Origin: 'https://demo.embarky.xyz',
  theme: 'dark',
  defaultChain: bsc,
  supportedChains: [bsc, mainnet],
  farcaster: {
    rpcUrl: 'https://optimism-rpc.publicnode.com',
    // domain: 'embarky.com',
    // siweUri: 'https://embarky.com/login',
  },
}

export default config
