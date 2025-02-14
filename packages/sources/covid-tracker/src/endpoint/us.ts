import { Requester, Validator, AdapterError } from '@chainlink/ea-bootstrap'
import { ExecuteWithConfig, Config } from '@chainlink/types'

export const supportedEndpoints = ['us']

const customParams = {
  field: false,
  date: false,
}

const validDate = (date: any) => {
  if (date) {
    if (isNaN(Number(date))) return false
    if (date.length != 8) return false
  }
  return true
}

const findDay = (payload: any, date: any) => {
  if (!date) return payload[0]
  // All historical dates are given, find the the correct one
  for (const index in payload) {
    if (payload[index].date === Number(date)) {
      return payload[index]
    }
    // Response body is sorted by descending data. If we see an earlier date we know our result doesn't exist.
    if (payload[index].date < Number(date)) {
      return null
    }
  }
  return null
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  const date = validator.validated.data.date
  const field = validator.validated.data.field || 'death'
  if (!validDate(date))
    throw new AdapterError({
      jobRunID,
      message: 'Invalid date format',
      statusCode: 400,
    })
  const suffix = date ? 'daily' : 'current'
  const url = `us/${suffix}.json`

  const options = {
    ...config.api,
    url,
  }

  const response = await Requester.request(options)
  const day = findDay(response.data, date)
  if (!day)
    throw new AdapterError({
      jobRunID,
      message: 'Date not found in response data',
      statusCode: 400,
    })
  response.data.result = Requester.validateResultNumber(day, [field])
  return Requester.success(jobRunID, response, config.verbose)
}
