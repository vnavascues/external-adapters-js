import { AdapterError, Logger, Requester, Validator } from '@chainlink/ea-bootstrap'
import { Config, ExecuteWithConfig } from '@chainlink/types'

export const supportedEndpoints = ['current-city']

const ABSOLUTE_ZERO_CELSIUS = -273.15
const ABSOLUTE_ZERO_KELVIN = 0
const ABSOLUTE_ZERO_FAHRENHEIT = -459.67

enum SupportedUnits {
  STANDARD = 'standard',
  METRIC = 'metric',
  IMPERIAL = 'imperial',
}

const customParams = {
  city: true,
  units: false,
}

function validateTemperature(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawResult: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [key: string]: any },
  path: (string | number)[],
  units: string,
) {
  if (typeof rawResult === 'undefined') {
    const message = 'Result could not be found in path'
    Logger.error(message, { data, path })
    throw new AdapterError({ message })
  }
  if (isNaN(Number(rawResult))) {
    const message = 'Invalid result'
    Logger.error(message, { data, path })
    throw new AdapterError({ message })
  }
  const result = Number(rawResult)

  if (
    units === SupportedUnits.IMPERIAL && result < ABSOLUTE_ZERO_FAHRENHEIT ||
    units === SupportedUnits.METRIC && result < ABSOLUTE_ZERO_CELSIUS ||
    result < ABSOLUTE_ZERO_KELVIN // NB: API default units is `standard`
  ) {
    const message = 'Invalid result: below absolute zero'
    Logger.error(message, { data, path })
    throw new AdapterError({ message })
  }
  return result
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  const city = validator.validated.data.city.toLowerCase()
  const units = validator.validated.data.units ? validator.validated.data.units.toLowerCase() : SupportedUnits.STANDARD
  const url = `/weather`

  const params = {
    appid: config.apiKey,
    q: city,
    units,
  }

  const options = { ...config.api, params, url }

  const response = await Requester.request(options)

  const path = ['main', 'temp']
  const rawResult = Requester.getResult(response.data, path)
  response.data.result = validateTemperature(rawResult, response.data, path, units)

  Logger.debug('New result: ' + response.data.result)

  return Requester.success(jobRunID, response, config.verbose)
}
