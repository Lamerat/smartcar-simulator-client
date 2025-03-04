import React, { useContext, useState, forwardRef } from 'react'
import { Container, Box, Slider, Paper, Stack , TextField, InputAdornment, FormControl, Select, MenuItem, InputLabel, IconButton, Dialog, Slide, Tooltip } from '@mui/material'
import SettingsContext from '../../Context/SettingsContext'
import ServerContext from '../../Context/ServerContext'
import BatteryFullIcon from '@mui/icons-material/BatteryFull'
import Battery0BarIcon from '@mui/icons-material/Battery0Bar'
import SignalCellular4BarIcon from '@mui/icons-material/SignalCellular4Bar'
import SignalCellular0BarIcon from '@mui/icons-material/SignalCellular0Bar'
import PlaceIcon from '@mui/icons-material/Place'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import PagesIcon from '@mui/icons-material/Pages'
import CakeIcon from '@mui/icons-material/Cake'
import SquareFootIcon from '@mui/icons-material/SquareFoot'
import PlumbingIcon from '@mui/icons-material/Plumbing'
import DoorButton from '../DoorButton/DoorButton'
import CloseIcon from '@mui/icons-material/Close'
import MapIcon from '@mui/icons-material/Map'
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps'


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})


const Main = () => {
  const { settingsState, setSettingsState } = useContext(SettingsContext)
  const { serverSettings } = useContext(ServerContext)
  const [showMapDialog, setShowMapDialog] = useState(false)

  const changeValue = (sector, field, value) => {
    settingsState[sector][field] = value
    setSettingsState({ ...settingsState })
  }

  const setCoordinates = (coordinates) => {
    const location = { latitude: coordinates.lat, longitude: coordinates.lng }
    setSettingsState({ ...settingsState, location })
  }

  return (
    <Container sx={{maxWidth: '1318px !important', border: '1px solid #1976D2' }} disableGutters={true}  >
      <Stack direction={'row'}>
        <Stack direction={'column'}>
          <Box sx={{
            backgroundImage: 'url(https://mailrouter.s3.eu-central-1.amazonaws.com/fightscout-devUpload/acbe7b71-fe3e-4f1a-8d6f-82d8a24d3d3a-RearCar.png)',
            height: '300px',
            width: '798px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
          >
            <DoorButton title='FRONT STORAGE' sx={{ mt: 10, ml: 2 }} field='storage' type='front' />
            <DoorButton title='SUNROOF' sx={{ mt: 4 }} field='sunroof' type='sunroof' />
            <Stack sx={{height: '300px', justifyContent: 'space-between'}}>
              <DoorButton title='BACK STORAGE' sx={{ mt: 10, mr: 2 }} field='storage' type='rear' />
              <DoorButton title='CHARGE POINT' sx={{ mb: 2, mr: 2 }} field='chargingPort' type='chargingPort' />
            </Stack>
          </Box>
          <Box sx={{
            backgroundImage: 'url(https://mailrouter.s3.eu-central-1.amazonaws.com/fightscout-devUpload/6c273845-f297-49c4-aac5-69a0761f095e-TopCar.png)',
            height: '468px',
            width: '798px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
          >
            <Box sx={{ width: '100px', height: '468px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', ml: 2, color: '#1976D2'}}>
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <TextField
                  size='small'
                  label='kPA'
                  type="number"
                  variant='outlined'
                  sx={{ width: '90px', mt: 2, mb: 2 }}
                  value={settingsState.tires.frontRight}
                  onChange={(e) => changeValue('tires', 'frontRight', e.target.valueAsNumber)}
                />
                <Box fontWeight={500} fontSize={13}>FRONT RIGHT</Box>
              </Box>
              
              <Box mt={3} mb={3}>
                <img width={'80px'} src='https://mailrouter.s3.eu-central-1.amazonaws.com/fightscout-devUpload/4d179e9b-b41e-46d3-9002-320f6672f6ab-tire_blue.png' alt=''/>
              </Box>

              <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <Box fontWeight={500} fontSize={13}>FRONT LEFT</Box>
                <TextField
                  size='small'
                  label='kPA'
                  type="number"
                  variant='outlined'
                  sx={{ width: '90px', mt: 2, mb: 2 }}
                  value={settingsState.tires.frontLeft}
                  onChange={(e) => changeValue('tires', 'frontLeft', e.target.valueAsNumber)}
                />
              </Box>
            </Box>


            <Box sx={{height: '468px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', mt: 2}}>
                <DoorButton title='FRONT RIGHT WINDOW' sx={{justifyContent: 'flex-start'}} field='windows' type='frontRight' />
                <Box height={16}></Box>
                <DoorButton title='FRONT RIGHT DOOR' sx={{justifyContent: 'flex-start'}} field='doors' type='frontRight' />
              </Box>
              <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', mb: 2}}>
                <DoorButton title='FRONT LEFT DOOR' sx={{justifyContent: 'flex-start'}} field='doors' type='frontLeft' />
                <Box height={16}></Box>
                <DoorButton title='FRONT LEFT WINDOW' sx={{justifyContent: 'flex-start'}} field='windows' type='frontLeft' />
              </Box>
            </Box>

            <Box sx={{height: '468px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', mt: 2}}>
                <DoorButton title='BACK RIGHT WINDOW' sx={{justifyContent: 'flex-start'}} field='windows' type='backRight' />
                <Box height={16}></Box>
                <DoorButton title='BACK RIGHT DOOR' sx={{justifyContent: 'flex-start'}} field='doors' type='backRight' />
              </Box>
              <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', mb: 2}}>
                <DoorButton title='BACK LEFT DOOR' sx={{justifyContent: 'flex-start'}} field='doors' type='backLeft' />
                <Box height={16}></Box>
                <DoorButton title='BACK LEFT WINDOW' sx={{justifyContent: 'flex-start'}} field='windows' type='backLeft' />
              </Box>
            </Box>

            <Box sx={{ width: '100px', height: '468px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#1976D2'}}>
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <TextField
                  size='small'
                  label='kPA'
                  type="number"
                  variant='outlined'
                  sx={{ width: '90px', mt: 2, mb: 2 }}
                  value={settingsState.tires.backRight}
                  onChange={(e) => changeValue('tires', 'backRight', e.target.valueAsNumber)}
                />
                <Box fontWeight={500} fontSize={13}>BACK RIGHT</Box>
              </Box>
              
              <Box mt={3} mb={3}>
                <img width={'80px'} src='https://mailrouter.s3.eu-central-1.amazonaws.com/fightscout-devUpload/4d179e9b-b41e-46d3-9002-320f6672f6ab-tire_blue.png' alt=''/>
              </Box>

              <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <Box fontWeight={500} fontSize={13}>BACK LEFT</Box>
                <TextField
                  size='small'
                  label='kPA'
                  type="number"
                  variant='outlined'
                  sx={{ width: '90px', mt: 2, mb: 2 }}
                  value={settingsState.tires.backLeft}
                  onChange={(e) => changeValue('tires', 'backLeft', e.target.valueAsNumber)}
                />
              </Box>
            </Box>
            
          </Box>
        </Stack>
          <Box width={'100%'} m={2} ml={6}>
            <Paper sx={{ p: 2, color: '#1976D2' }} elevation={3}>
              <Box mb={2} minHeight='34px' alignItems='center' display='flex' justifyContent='space-between' fontWeight={500} borderBottom='1px solid #1976D2'>
                <Box>ATTRIBUTES AND VIN</Box>
              </Box>
              <Stack direction={'row'} spacing={3}>
                <TextField
                  label='Make'
                  size='small'
                  value={settingsState.attributes.make}
                  onChange={(e) => changeValue('attributes', 'make', e.target.value)}
                  slotProps={{ input: { startAdornment: (<InputAdornment position="start"><PlumbingIcon /></InputAdornment>)}}}
                />
                <TextField
                  label='Model'
                  size='small'
                  value={settingsState.attributes.model}
                  onChange={(e) => changeValue('attributes', 'model', e.target.value)}
                  slotProps={{ input: { startAdornment: (<InputAdornment position="start"><SquareFootIcon /></InputAdornment>)}}}
                />
              </Stack>
              <Box height={24}/>
              <Stack direction={'row'} spacing={3}>
                <TextField
                  label='Year'
                  size='small'
                  type='number'
                  value={settingsState.attributes.year}
                  onChange={(e) => changeValue('attributes', 'year', e.target.valueAsNumber)}
                  slotProps={{ input: { startAdornment: (<InputAdornment position="start"><CakeIcon /></InputAdornment>) }}}
                />
                <TextField
                  label='VIN'
                  size='small'
                  value={settingsState.vin.vin}
                  onChange={(e) => changeValue('vin', 'vin', e.target.value)}
                  slotProps={{ input: { startAdornment: (<InputAdornment position="start"><PagesIcon /></InputAdornment>)}}}
                />
              </Stack>
            </Paper>

            <Paper sx={{ p: 2, color: '#1976D2', mt: 2 }} elevation={3}>
              <Box mb={2} alignItems='center' display='flex' justifyContent='space-between' fontWeight={500} borderBottom='1px solid #1976D2'>
                <Box>LOCATION AND ODOMETER</Box>
                <IconButton size='small' color='inherit' onClick={() => setShowMapDialog(true)}>
                  <Tooltip title='Show map' arrow><MapIcon /></Tooltip>
                </IconButton>
              </Box>
              <Stack direction={'row'} spacing={3} mb={3}>
                <TextField
                  label='Latitude'
                  size='small'
                  type='number'
                  value={settingsState.location.latitude}
                  onChange={(e) => changeValue('location', 'latitude', e.target.valueAsNumber)}
                  slotProps={{ input: { startAdornment: (<InputAdornment position="start"><PlaceIcon /></InputAdornment>)}}}
                />
                <TextField
                  label='Longitude'
                  size='small'
                  type='number'
                  value={settingsState.location.longitude}
                  onChange={(e) => changeValue('location', 'longitude', e.target.valueAsNumber)}
                  slotProps={{ input: { startAdornment: (<InputAdornment position="start"><PlaceIcon /></InputAdornment>)}}}
                />
              </Stack>
              <TextField
                fullWidth
                label='Odometer'
                size='small'
                type='number'
                value={settingsState.odometer.distance}
                onChange={(e) => changeValue('odometer', 'distance', e.target.valueAsNumber)}
                slotProps={{ input: { startAdornment: (<InputAdornment position="start"><DirectionsCarIcon /></InputAdornment>)}}}
              />
            </Paper>

            <Paper sx={{ p: 2, color: '#1976D2', mt: 2 }} elevation={3}>
              <Box mb={2} minHeight='34px' alignItems='center' display='flex' justifyContent='space-between' fontWeight={500} borderBottom='1px solid #1976D2'>
                <Box>BATTERY AND RANGE</Box>
              </Box>
              <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
                <Battery0BarIcon />
                <Slider
                  valueLabelDisplay='auto'
                  min={0}
                  max={1}
                  step={0.01}
                  value={settingsState.batteryLevel.percentRemaining}
                  onChange={(e) => changeValue('batteryLevel', 'percentRemaining', e.target.value)}
                  marks={[{ value: 0, label: '0%' }, { value: 0.25, label: '25%' }, { value: 0.5, label: '50%' }, { value: 0.75, label: '75%' }, { value: 1, label: '100%' }]}
                />
                <BatteryFullIcon />
              </Stack>
                
              <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 2, mt: 4 }}>
                <SignalCellular0BarIcon />
                <Slider
                  valueLabelDisplay='auto'
                  min={0}
                  max={400}
                  step={1}
                  value={settingsState.batteryLevel.range}
                  onChange={(e) => changeValue('batteryLevel', 'range', e.target.value)}
                  marks={[{ value: 0, label: '0km' }, { value: 100, label: '100km' }, { value: 200, label: '200km' }, { value: 300, label: '300km' }, { value: 400, label: '400km' }]}
                />
                <SignalCellular4BarIcon />
              </Stack>
            </Paper>
            <Paper sx={{ p: 2, color: '#1976D2', mt: 2 }} elevation={3}>
              <Box mb={2} minHeight='34px' alignItems='center' display='flex' justifyContent='space-between' fontWeight={500} borderBottom='1px solid #1976D2'>
                <Box>OTHER</Box>
              </Box>
              <Stack direction={'row'} spacing={3}>
                <FormControl sx={{ m: 1, minWidth: 120 }} size='small' fullWidth>
                  <InputLabel id='charge-status-label'>Charge Status</InputLabel>
                  <Select
                    labelId='charge-status-label'
                    label="Charge Status"
                    value={settingsState.chargeStatus.state}
                    onChange={(e) => changeValue('chargeStatus', 'state', e.target.value)}
                  >
                    <MenuItem value={'NOT_CHARGING'}>Not charging</MenuItem>
                    <MenuItem value={'CHARGING'}>Charging</MenuItem>
                    <MenuItem value={'FULLY_CHARGED'}>Fully charged</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} size='small' fullWidth>
                  <InputLabel id='charge-cable-label'>Cable is plugged</InputLabel>
                  <Select
                    labelId='charge-cable-label'
                    label="Cable is plugged"
                    value={settingsState.chargeStatus.isPluggedIn}
                    onChange={(e) => changeValue('chargeStatus', 'isPluggedIn', e.target.value)}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              
            </Paper>
          </Box>
      </Stack>

      <Dialog open={showMapDialog} slots={{transition: Transition}} keepMounted onClose={() => setShowMapDialog(false)} maxWidth='sm' fullWidth>
        <Box m={2}>
        <Box mb={2} fontWeight={500} pb={0.5} borderBottom='1px solid #1976D2' color='#1976D2' display='flex' alignItems='center' justifyContent='space-between'>
            CHOOSE LOCATION
            <IconButton color='inherit' size='small' onClick={() => setShowMapDialog(false)}><Tooltip title='Close' arrow><CloseIcon /></Tooltip></IconButton>
          </Box>
          <APIProvider apiKey={serverSettings.googleAPIKey}>
            <Map
              style={{ width: '568px', height: '500px' }}
              defaultCenter={{ lat: settingsState.location.latitude, lng: settingsState.location.longitude }}
              defaultZoom={12}
              disableDefaultUI={true}
              onClick={(e) => setCoordinates(e.detail.latLng)}
            >
              <Marker position={{ lat: settingsState.location.latitude, lng: settingsState.location.longitude }} />
            </Map>
          </APIProvider>
        </Box>
      </Dialog>
      
    </Container>
  )
}

export default Main