import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SettingsContext from './Context/SettingsContext'
import ServerContext from './Context/ServerContext'
import Main from './Components/Main/Main'
import MenuBar from './Components/MenuBar/MenuBar'
import settings from './Config/default-settings'
import defaultServerSettings from './Config/server-default'


function App() {
  const [settingsState, setSettingsState] = useState((JSON.parse(localStorage.getItem('SmartcarSettings'))) || settings)
  const [serverSettings, setServerSettings] = useState((JSON.parse(localStorage.getItem('SmartCarServer'))) || defaultServerSettings)

  return (
    <SettingsContext.Provider value={{ settingsState, setSettingsState }}>
      <ServerContext.Provider value={{ serverSettings, setServerSettings }}>
        <BrowserRouter>
          <MenuBar />
          <Routes>
            <Route exact path='/' element={<Main />}/>
          </Routes>
        </BrowserRouter>
      </ServerContext.Provider>
    </SettingsContext.Provider>
  );
}

export default App;
