import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { ExecuteWithConfig, Config } from '@chainlink/types'

export const supportedEndpoints = ['stock', 'price']

const customError = (data: any) => data.Response === 'Error'

const commonKeys: Record<string, string> = {
  N225: 'nk225',
}

const customParams = {
  base: ['base', 'from', 'coin'],
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id

  const url = `get_real_data`
  let idx = validator.validated.data.base.toUpperCase()

  idx = commonKeys[idx] || idx

  const params = {
    idx,
  }

  const reqConfig = {
    ...config.api,
    params,
    url,
  }

  const response = await Requester.request(reqConfig, customError)
  response.data.result = parseFloat(response.data.price.replace(',', ''))
  return Requester.success(jobRunID, response, config.verbose)
}
