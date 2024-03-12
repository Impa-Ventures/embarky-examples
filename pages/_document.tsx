import { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'
import embarkyConfig from '@/config/embarky.config'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <ColorModeScript initialColorMode={embarkyConfig.theme as any} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
