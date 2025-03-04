import { createContext } from 'react'
import defaultServerSettings from '../Config/server-default'


const SettingsContext = createContext({
  serverSettings: defaultServerSettings,
  setServerSettings: () => {}
})

export default SettingsContext
