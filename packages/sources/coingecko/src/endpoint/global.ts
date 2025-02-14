import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { Config, ExecuteWithConfig } from '@chainlink/types'

export const supportedEndpoints = ['globalmarketcap', 'dominance']

export const endpointPaths = {
  globalmarketcap: 'total_market_cap',
  dominance: 'market_cap_percentage'
}

const customError = (data: any) => {
  if (Object.keys(data).length === 0) return true
  return false
}

const customParams = {
  market: ['quote', 'to', 'market', 'coin'],
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error
  const jobRunID = validator.validated.id
  const market = validator.validated.data.market.toLowerCase()
  const path = validator.validated.data.path
  console.log(path)
  const url = '/global'

  const options = {
    ...config.api,
    url,
    params: {
      x_cg_pro_api_key: config.apiKey,
    },
  }

  const response = await Requester.request(options, customError)
  response.data.result = Requester.validateResultNumber(response.data, ['data', path, market])

  return Requester.success(jobRunID, response, config.verbose)
}
