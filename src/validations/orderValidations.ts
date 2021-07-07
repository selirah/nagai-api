import validator from 'validator'
import { __Order__ } from '../models/__Order__'

export const validateOrder = (inputs: __Order__) => {
  if (validator.isEmpty(`${inputs.items}`)) {
    return [
      {
        field: 'items',
        message: 'Transaction must take place'
      }
    ]
  }
  if (validator.isEmpty(`${inputs.clientId}`)) {
    return [
      {
        field: 'clientId',
        message: 'Client is required'
      }
    ]
  }

  return null
}
