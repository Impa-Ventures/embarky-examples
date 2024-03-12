import { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'
import embarkyConfig from '@/config/embarky.config'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {/* @ts-ignore */}
        <ColorModeScript initialColorMode={embarkyConfig.theme} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
