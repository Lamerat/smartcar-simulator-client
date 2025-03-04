import { createContext } from 'react'
import settings from '../Config/default-settings'

const SettingsContext = createContext({
  settingsState: settings,
  setSettingsState: () => {}
})

export default SettingsContext
