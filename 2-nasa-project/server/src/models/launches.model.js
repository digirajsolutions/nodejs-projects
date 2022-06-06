const launches = new Map()

let latestFlightNumber = 100

const launch = {
  flightNumber: 101,
  mission: 'Kepler Exploration XA1',
  rocket: 'Explorer IS1',
  launchDate: new Date('October 21, 2025'),
  target: 'Kepler-442 b',
  customer: ['Digiraj', 'NASA'],
  upcoming: true,
  success: true,
}

launches.set(launch.flightNumber, launch)

function addNewLaunch(launch) {
  latestFlightNumber++
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['Digiraj Solutions', 'NASA'],
      flightNumber: latestFlightNumber,
    })
  )
}

module.exports = { launches, addNewLaunch }
