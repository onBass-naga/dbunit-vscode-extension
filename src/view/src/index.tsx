import React from 'react'
import { ContextProvider } from './core/Context'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, ColorModeScript, ThemeConfig } from '@chakra-ui/react'
import App from './App'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './components/ErrorFallback'

if (typeof window !== 'undefined') {
  const defaultStyle = document.getElementById('_defaultStyles')
  defaultStyle?.remove()
}

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

const mode = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light'
const config: ThemeConfig = {
  initialColorMode: mode,
  useSystemColorMode: true,
}

root.render(
  <React.StrictMode>
    <ContextProvider>
      <ChakraProvider>
        <ColorModeScript initialColorMode={config.initialColorMode} />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <App />
        </ErrorBoundary>
      </ChakraProvider>
    </ContextProvider>
  </React.StrictMode>
)
