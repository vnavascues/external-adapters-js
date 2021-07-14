import { Requester } from '@chainlink/ea-bootstrap'
import { Config } from '@chainlink/types'

export const NAME = 'OPEN_WEATHER_MAP'

export const DEFAULT_ENDPOINT = 'current-city'
export const DEFAULT_BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const makeConfig = (prefix?: string): Config => {
  const config = Requester.getDefaultConfig(prefix, true)
  config.api.baseURL = config.api.baseURL || DEFAULT_BASE_URL
  config.defaultEndpoint = DEFAULT_ENDPOINT
  return config
}
