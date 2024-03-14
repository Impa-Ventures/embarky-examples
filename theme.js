import { extendTheme } from '@chakra-ui/react'

const modes = {
  dark: {
    styles: {
      global: {
        body: {
          color: '#e2e2e4',
        },
      },
    },
    colors: {
      primary: '#e2e2e4',
      second: '#969696',
      brand: '#767BFF',
      border: '#767BFF',
      dark: {
        bg: '#232325',
        grayBg: 'RGBA(0, 0, 0, 0.36)',
        lightBg: '#3e3e42',
      },
    },
    components: {
      Button: {
        variants: {
          solid: {
            color: 'white',
            bg: 'brand',
            _hover: {
              opacity: 0.9,
              bg: 'brand',
            },
            _active: {
              bg: 'brand',
            },
          },
          outline: {
            border: '1px solid',
            borderColor: 'border',
            color: 'brand',
            bg: '#1E1E1E',
            height: '40px',
            fontSize: '14px',
            fontWeight: 500,
            _hover: {
              bg: '#131313',
            },
            _active: {
              bg: '#131313',
            },
          },
        },
      },
    },
  },

  light: {
    styles: {
      global: {
        body: {
          color: '#e2e2e4',
        },
      },
    },
    colors: {
      primary: '#e2e2e4',
      second: '#969696',
      brand: '#767BFF',
      border: '#767BFF',
      dark: {
        bg: '#232325',
        grayBg: 'RGBA(0, 0, 0, 0.36)',
        lightBg: '#3e3e42',
      },
    },
    components: {
      Button: {
        variants: {
          solid: {
            color: 'white',
            bg: 'brand',
            _hover: {
              opacity: 0.9,
              bg: 'brand',
            },
            _active: {
              bg: 'brand',
            },
          },
          outline: {
            border: '1px solid',
            borderColor: 'border',
            color: 'brand',
            bg: '#ffffff',
            height: '40px',
            fontSize: '14px',
            fontWeight: 500,
            _hover: {
              bg: '#E4E7FE',
            },
            _active: {
              bg: '#E4E7FE',
            },
          },
        },
      },
    },
  },
}

export const getTheme = (_theme) =>
  extendTheme({
    useSystemColorMode: false,
    initialColorMode: _theme,
    ...modes[_theme],
  })
