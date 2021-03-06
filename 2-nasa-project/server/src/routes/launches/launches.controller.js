const { launches, addNewLaunch } = require('../../models/launches.model')

function getAllLaunches(req, res) {
  return res.status(200).json(Array.from(launches.values()))
}

function httpAddNewLaunch(req, res) {
  const launch = req.body
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: 'Missing a property.',
    })
  }

  launch.launchDate = new Date(launch.launchDate)
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date',
    })
  }

  addNewLaunch(launch)
  return res.status(201).json(launch)
}

module.exports = { getAllLaunches, httpAddNewLaunch }
