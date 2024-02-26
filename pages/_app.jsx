'use client'

import { ToastContainer } from 'react-toastify'
import { ChakraProvider } from '@chakra-ui/react'
import { EmbarkyProvider } from '@embarky/react'
import { getTheme } from '@/theme'
import Layout from '@/components/Layout'
import embarkyConfig from '@/config/embarky.config'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'

const theme = getTheme(embarkyConfig.theme)
export default function App({ Component, pageProps }) {
  return (
    <EmbarkyProvider config={embarkyConfig}>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </EmbarkyProvider>
  )
}
