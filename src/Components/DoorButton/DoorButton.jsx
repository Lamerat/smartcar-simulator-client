import React, { useContext } from 'react'
import SettingsContext from '../../Context/SettingsContext'
import Button from '@mui/material/Button'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'

const DoorButton = ({ title, type, field, sx }) => {
  const { settingsState, setSettingsState } = useContext(SettingsContext)

  const getValue = () => settingsState.lockStatus[field].find(x => x.type === type).status

  const setValue = () => {
    const newValue = getValue() === 'OPEN' ? 'CLOSED' : 'OPEN'
    settingsState.lockStatus[field].find(x => x.type === type).status = newValue
    setSettingsState({ ...settingsState }) 
  }

  return (
    <Button
      color={getValue() === 'OPEN' ? 'warning' : 'primary'}
      startIcon={getValue() === 'OPEN' ? <WarningIcon /> : <CheckCircleIcon />}
      size='small'
      variant='outlined'
      sx={sx}
      onClick={setValue}
    >
      {title}
    </Button>
  )
}


export default DoorButton