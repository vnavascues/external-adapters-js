import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { Config, AdapterRequest } from '@chainlink/types'
import { DEFAULT_BASE_URL } from '../config'

export const supportedEndpoints = ['assetAttestation']

const customError = (data: any) => data.Response === 'Error'

export const inputParams = {
  asset: true,
}

type Attestation = {
   asset: string
  auditorName: string
  lastAttestedAt: string
  amount: number
  verified: boolean
}

const getAttestationURI = (asset: string) => `/asset-attestations/${asset.toUpperCase()}`

const toAttestation = async (config: Config, asset: string): Promise<Attestation> => {
  const url = getAttestationURI(asset)
  const reqConfig = { ...config.api, baseURL: DEFAULT_BASE_URL, url }

  const response = await Requester.request(reqConfig, customError)
  return {
    asset: asset,
    auditorName: response.data.auditorName,
    lastAttestedAt: response.data.lastAttestedAt,
    amount: Requester.validateResultNumber(response.data, ['amount']),
    verified: response.data.verified,
  }
}

export const execute = async (request: AdapterRequest, config: Config): Promise<Attestation> => {
  const validator = new Validator(request, inputParams)
  if (validator.error) throw validator.error
  const asset = validator.validated.data.asset

  if (!asset) throw Error('asset must be provided')

  const response = await toAttestation(config, asset)
  return response
}
