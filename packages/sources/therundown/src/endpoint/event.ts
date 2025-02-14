import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { ExecuteWithConfig, Config } from '@chainlink/types'

export const supportedEndpoints = ['event']

const customParams = {
  eventId: true
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  const eventId = validator.validated.data.eventId
  const url = `/events/${eventId}`

  const reqConfig = {
    ...config.api,
    headers: {
      ...config.api.headers,
      'x-rapidapi-key': config.apiKey,
    },
    params: {
      include: 'scores',
    },
    url,
  }

  const response = await Requester.request(reqConfig)
  response.data.result = response.data

  return Requester.success(jobRunID, response, config.verbose)
}
