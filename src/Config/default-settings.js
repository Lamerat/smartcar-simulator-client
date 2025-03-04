const settings = {
  attributes: {
    id: 'dbc1a6d0-7704-44ba-ac35-731ad1cd76e9',
    make: 'TESLA',
    model: 'Model Y',
    year: 2022
  },
  odometer: {
    'distance': 47000
  },
  location: {
    latitude: 42.64043740124748,
    longitude: 23.409442825962795
  },
  vin: {
    vin: '0SCTESL03CBE21A16'
  },
  batteryLevel: {
    percentRemaining: 0.35,
    range: 100
  },
  lockStatus: {
    isLocked: true,
    doors: [
      {
        type: 'frontLeft',
        status: 'CLOSED'
      },
      {
        type: 'frontRight',
        status: 'CLOSED'
      },
      {
        type: 'backLeft',
        status: 'CLOSED'
      },
      {
        type: 'backRight',
        status: 'CLOSED'
      }
    ],
    windows: [
      {
        type: 'frontLeft',
        status: 'CLOSED'
      },
      {
        type: 'frontRight',
        status: 'CLOSED'
      },
      {
        type: 'backLeft',
        status: 'CLOSED'
      },
      {
        type: 'backRight',
        status: 'CLOSED'
      }
    ],
    sunroof: [
      {
        type: 'sunroof',
        status : 'CLOSED'
      }
    ],
    storage: [
      {
        type: 'front',
        status: 'CLOSED'
      },
      {
        type: 'rear',
        status: 'CLOSED'
      }
    ],
    chargingPort: [
      {
        type: 'chargingPort',
        status: 'CLOSED'
      }
    ]
  },
  tires: {
    backLeft: 219,
    backRight: 219,
    frontLeft: 219,
    frontRight: 219
  },
  chargeStatus: {
    isPluggedIn: false,
    state: 'NOT_CHARGING'
  }
}

export default settings