import { Requester } from '@chainlink/ea-bootstrap'
import { assertError, assertSuccess } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/types'
import { makeExecute } from '../../src/adapter'

describe('execute', () => {
  const jobID = '1'
  const execute = makeExecute()
  process.env.API_KEY = process.env.API_KEY ?? 'test_api_key'

  describe('successful calls @integration', () => {
    const requests = [
      {
        name: 'id not supplied',
        testData: { data: { city: 'bristol' } },
      },
      {
        name: 'city (q={city name})',
        testData: { id: jobID, data: { city: 'bristol' } },
      },
      {
        name: 'city (q={city name},{country code})',
        testData: { id: jobID, data: { city: 'bristol,gb' } },
      },
      {
        name: 'city (q={city name},{state code},{country code})',
        testData: { id: jobID, data: { city: 'springfield,or,us' } },
      },
      {
        name: 'city/units',
        testData: { id: jobID, data: { city: 'bristol', units: 'metric' } },
      },
      {
        name: 'city/units (default)',
        testData: { id: jobID, data: { city: 'bristol', units: 'not_real' } },
      },
    ]

    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        const data = await execute(req.testData as AdapterRequest)
        assertSuccess({ expected: 200, actual: data.statusCode }, data, jobID)
        expect(typeof data.result).toBe('number')
        expect(data.data.result).toBe(data.result)
      })
    })
  })

  describe('error calls @integration', () => {
    const requests = [
      {
        name: 'city is empty string',
        testData: { id: jobID, data: { city: '' } },
      },
      {
        name: 'city not found',
        testData: { id: jobID, data: { city: 'not_real' } },
      },
    ]

    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        expect.hasAssertions()
        try {
          await execute(req.testData as AdapterRequest)
        } catch (error) {
          const errorResp = Requester.errored(jobID, error)
          assertError({ expected: 500, actual: errorResp.statusCode }, errorResp, jobID)
        }
      })
    })
  })
})
