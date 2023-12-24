import { createContext, useContext } from 'react'
import useStateReducer, { defaultStateReducer } from './reducer'

export const Context = createContext(defaultStateReducer)

type Props = {
  children: JSX.Element
}

export function ContextProvider(props: Props) {
  return (
    <Context.Provider value={useStateReducer()}>
      {props.children}
    </Context.Provider>
  )
}

export function useAppContext() {
  return useContext(Context)
}
