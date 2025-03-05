import React, { useContext, useState, useEffect, forwardRef } from 'react'
import { Container, Box, Typography, IconButton, Tooltip, Snackbar, Alert, Slide, Dialog, FormControl, Button, Select, MenuItem, InputLabel,TextField } from '@mui/material'
import SettingsContext from '../../Context/SettingsContext'
import ServerContext from '../../Context/ServerContext'
import SettingsIcon from '@mui/icons-material/Settings'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import DoorBackIcon from '@mui/icons-material/DoorBack'
import PowerIcon from '@mui/icons-material/Power'
import PowerOffIcon from '@mui/icons-material/PowerOff'
import KeyIcon from '@mui/icons-material/Key'
import KeyOffIcon from '@mui/icons-material/KeyOff'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

let lastServerSettings

const MenuBar = () => {
  const { settingsState, setSettingsState } = useContext(SettingsContext)
  const {serverSettings, setServerSettings} = useContext(ServerContext)
  const [ ws, setWs ] = useState(null)
  const [showSnack, setShowSnack] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [snackVariant, setSnackVariant] = useState('error')
  const [showSettingsDialog, setShowSettingDialog] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(false)
  const [simulateUnlockProblem, setSimulateUnlockProblem] = useState(false)

  useEffect(() => {
    // console.log('RENDER')
    if (settingsState.lockStatus.doors.some(x => x.status === 'OPEN') && settingsState.lockStatus.isLocked === true) {
      setSettingsState(settingsState => ({ ...settingsState, lockStatus: { ...settingsState.lockStatus, isLocked: false }}))
    }

    if (settingsState.chargeStatus.isPluggedIn && settingsState.lockStatus.chargingPort.some(x => x.status === 'CLOSED')) {
      setSettingsState(settingsState => ({ ...settingsState, lockStatus: { ...settingsState.lockStatus, chargingPort: settingsState.lockStatus.chargingPort.map(x => ({ type: x.type, status: 'OPEN' })) }}))
    }

    if (!settingsState.chargeStatus.isPluggedIn && settingsState.chargeStatus.state !== 'NOT_CHARGING') {
      setSettingsState(settingsState => ({ ...settingsState, chargeStatus: { ...settingsState.chargeStatus, isPluggedIn: true } }))
    }

  }, [setSettingsState, settingsState])


  const startConnection = () => {
    const { protocol, address, smartcarId } = serverSettings
    const webSocket = new WebSocket(`${protocol}://${address}?smartcarId=${smartcarId}`)
    setWs(webSocket)
  }

  const endConnection = () => {
    ws.close()
  }


  const haveSomeOpen = () => {
    const allStatues = Object.keys(settingsState.lockStatus).filter(x => x !== 'isLocked').map(x => settingsState.lockStatus[x].map(s => s.status)).flat()
    return allStatues.some(x => x === 'OPEN')
  }


  const allDoorsControl = () => {
    const action = haveSomeOpen() ? 'CLOSED' : 'OPEN'
    Object.keys(settingsState.lockStatus).filter(x => x !== 'isLocked').forEach(x => settingsState.lockStatus[x].forEach(s => s.status = action))
    setSettingsState({ ...settingsState })
  }


  const haveOpenDoor = () => settingsState.lockStatus.doors.some(x => x.status !== 'CLOSED')


  const lockControl = (command) => {
    const action = typeof command === 'boolean' ? command : !settingsState.lockStatus.isLocked
    if (action === true && haveOpenDoor()) {
      setSnackMessage('Cannot lock car - have opened door')
      setSnackVariant('error')
      setShowSnack(true)
      return
    }

    settingsState.lockStatus.isLocked = action
    setSettingsState({ ...settingsState })
  }

  const openSettingDialog = () => {
    lastServerSettings = { ...serverSettings }
    setShowSettingDialog(true)
  }


  const closeSettingDialog = () => {
    setServerSettings(lastServerSettings)
    setShowSettingDialog(false)
  }


  const setServerSettingsValue = (field, value) => {
    serverSettings[field] = value
    setServerSettings({ ...serverSettings })
  }


  const saveServerSettings = () => {
    localStorage.setItem('SmartCarServer', JSON.stringify(serverSettings))
    setShowSettingDialog(false)
  }

  const saveCarSettings = () => {
    localStorage.setItem('SmartcarSettings', JSON.stringify(settingsState))
    setSnackVariant('success')
    setSnackMessage('Car settings was saved')
    setShowSnack(true)
  }


  if (ws) {
    ws.onopen = () => {
      setConnectionStatus(true)
      setSnackVariant('success')
      setSnackMessage('Connected to server')
      setShowSnack(true)

      
      ws.send(JSON.stringify({ action: 'init', payload: settingsState, responseId: null }))
    }

    ws.onclose = (event) => {
      if (event.code === 1006) {
        setSnackVariant('error')
        setSnackMessage('Lost connection to server')
        setShowSnack(true)
      } else {
        setSnackVariant('warning')
        setSnackMessage('Disconnected from server')
        setShowSnack(true)
        setTimeout(() => startConnection(), 2000)
      }
      
      setConnectionStatus(false)
      setTimeout(() => startConnection(), 2000)
      setWs(null)
    }

    ws.onmessage = (msg) => {
      const { action, responseId, payload } = JSON.parse(msg.data)

      if (action === 'requestData') {
        const { property } = payload

        ws.send(JSON.stringify({ action: 'receiveData', payload: { success: true, message: settingsState, property, responseId } }))
      } else if (action === 'lockCommand') {
        const { action } = payload
        if (action === 'LOCK' && haveOpenDoor()) {
          setSnackMessage('Cannot lock car - have opened door')
          setSnackVariant('error')
          setShowSnack(true)
          ws.send(JSON.stringify({ action: 'lockCommand', payload: { success: false, message: { error: 'Car have opened door' }, responseId } }))
        } else if (action === 'UNLOCK' && simulateUnlockProblem) {
          ws.send(JSON.stringify({ action: 'lockCommand', payload: { success: false, message: { error: 'Problem with unlock car' }, responseId } }))
        } else {
          lockControl(action === 'LOCK')
          ws.send(JSON.stringify({ action: 'lockCommand', payload: { success: true, message: { message: 'Successfully sent request to vehicle', status: 'success' }, responseId } }))
        }
      }
    }   
  }

  return (
    <Container sx={{maxWidth: '1366px !important'}}>
      <Box height={'44px'} bgcolor='#1976D2' display='flex' alignItems='center' justifyContent='space-between' color='white' p={1} pl={3} pr={3}>
        <Typography variant='h5'>{settingsState.attributes.make} {settingsState.attributes.model} {settingsState.attributes.year}</Typography>

        <Box display='flex'>
          <Box color={simulateUnlockProblem ? 'gold' : 'white'}>
              <IconButton color='inherit' size='small' onClick={() => setSimulateUnlockProblem(!simulateUnlockProblem)}>
                <Tooltip title={`Simulate unlock problem - ${simulateUnlockProblem ? 'ON' : 'OFF'}`} arrow>{simulateUnlockProblem ? <KeyIcon /> : <KeyOffIcon />}</Tooltip>
              </IconButton>
            </Box>

          <Box margin={0.8} borderRight='1px solid white' borderLeft='1px solid white'></Box>

          <Box color={settingsState.lockStatus.isLocked === false ? 'gold' : 'white'}>
            <IconButton color='inherit' size='small' onClick={lockControl}>
              <Tooltip title={settingsState.lockStatus.isLocked ? 'Car is locked' : 'Car is unlocked'} arrow>{settingsState.lockStatus.isLocked ? <LockIcon /> : <LockOpenIcon />}</Tooltip>
            </IconButton>
          </Box>
          
          <Box color={haveSomeOpen() ? 'gold' : 'white'}>
            <IconButton color='inherit' size='small' onClick={() => allDoorsControl()}>
              <Tooltip title={haveSomeOpen() ? 'Have something open - Click to close all' : 'All entrances is closed - Click to open all'} arrow>
                {haveSomeOpen() ? <MeetingRoomIcon /> : <DoorBackIcon /> }
              </Tooltip>
            </IconButton>
          </Box>

          <Box margin={0.8} borderRight='1px solid white' borderLeft='1px solid white'></Box>

          <IconButton color='inherit' size='small' onClick={connectionStatus ? endConnection : startConnection}>
            <Tooltip title={ connectionStatus ? 'Disconnect from server' : 'Connect to server' } arrow>
              { connectionStatus ? <PowerIcon /> : <PowerOffIcon /> }
            </Tooltip>
          </IconButton>

          <IconButton color='inherit' size='small' onClick={saveCarSettings}>
            <Tooltip title='Save car settings' arrow><SaveIcon /></Tooltip>
          </IconButton>

          <IconButton color='inherit' size='small' onClick={openSettingDialog}>
            <Tooltip title='Settings' arrow><SettingsIcon /></Tooltip>
          </IconButton>
        </Box>
        
      </Box>

      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} open={showSnack} onClose={() => setShowSnack(false)} autoHideDuration={5000}>
        <Alert onClose={() => setShowSnack(false)} severity={snackVariant} variant='filled' sx={{ width: '100%' }} >{snackMessage}</Alert>
      </Snackbar>

      <Dialog open={showSettingsDialog} slots={{transition: Transition}} keepMounted onClose={() => setShowSettingDialog(false)} maxWidth='sm' fullWidth>
        <Box p={2}> 
          <Box mb={4} fontWeight={500} pb={0.5} borderBottom='1px solid #1976D2' color='#1976D2' display='flex' alignItems='center' justifyContent='space-between'>
            SETTINGS
            <IconButton color='inherit' size='small' onClick={closeSettingDialog}><Tooltip title='Close' arrow><CloseIcon /></Tooltip></IconButton>
          </Box>
          <Box display='flex' alignItems='center' mb={4}>
            <FormControl sx={{ minWidth: 100 }} size='small'>
              <InputLabel>Protocol</InputLabel>
              <Select
                size='small'
                label='Protocol'
                value={serverSettings.protocol}
                onChange={(e) => setServerSettingsValue('protocol', e.target.value)}
              >
                <MenuItem value='ws'>ws</MenuItem>
                <MenuItem value='wss'>wss</MenuItem>
              </Select>
            </FormControl>
            <Box width={16}/>
            <TextField
              label='Address'
              fullWidth
              size='small'
              value={serverSettings.address}
              onChange={(e) => setServerSettingsValue('address', e.target.value)}
            />
            </Box>
            <TextField label='Smartcar ID' fullWidth size='small' value={serverSettings.smartcarId} onChange={(e) => setServerSettingsValue('smartcarId', e.target.value)} />

            <TextField sx={{mt: 4}} label='Google API Key' fullWidth size='small' value={serverSettings.googleAPIKey} onChange={(e) => setServerSettingsValue('googleAPIKey', e.target.value)} />
        </Box>
        <Box p={2} display='flex' justifyContent='right'> 
          <Button variant='outlined' startIcon={<SaveIcon />} onClick={saveServerSettings}>SAVE</Button>
        </Box>
      </Dialog>
    </Container>
  )
}


export default MenuBar