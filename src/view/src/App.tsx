import React, { useEffect } from 'react'

import './App.css'
import Container from './components/Container'
import { parseXmlString } from './utils/converter'
import { useAppContext } from './core/Context'
import { useVsCodeApi } from './core/useVsCodeApi'
import { serialize } from './utils/serializer'
import { isDefaultState } from './core/reducer'
import { useErrorBoundary } from 'react-error-boundary'
const vscode = useVsCodeApi()

export default function App() {
  const { showBoundary } = useErrorBoundary()
  const { state, dispatch } = useAppContext()

  useEffect(() => {
    if (isDefaultState(state)) {
      return
    }

    console.log('state changed: ' + JSON.stringify(state.tables[0].rows[0]))
    vscode.setState(state)
    vscode.postMessage({
      type: 'apply',
      text: serialize(state),
    })
  })

  useEffect(() => {
    // 拡張側からのイベントを受け取る関数
    const onMessage = (event: MessageEvent) => {
      const message = event.data as { type?: string; xml?: string }

      if (message && typeof message.xml === 'string') {
        try {
          const xml = parseXmlString(message.xml)

          dispatch({
            type: 'updateXml',
            payload: { xml },
          })
        } catch (error: any) {
          showBoundary(error)
        }
      }
    }

    window.addEventListener('message', onMessage)

    // xml をもらうためにイベントを送信する
    vscode.postMessage({ type: 'ready' })

    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [])

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (e: MediaQueryListEvent) => {
      dispatch({
        type: 'updateDarkMode',
        payload: { darkmode: e.matches },
      })
    }

    mediaQueryList.addEventListener('change', listener)

    return () => mediaQueryList.removeEventListener('change', listener)
  })

  return (
    <div className="App">
      <Container></Container>
    </div>
  )
}
