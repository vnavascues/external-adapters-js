import { expose } from '@chainlink/ea-bootstrap'
import { makeExecute, makeWSHandler } from './adapter'
import { NAME, makeConfig } from './config'

const { server } = expose(makeExecute(), makeWSHandler())
export { NAME, makeExecute, makeConfig, server }
