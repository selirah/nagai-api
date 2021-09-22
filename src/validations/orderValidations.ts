import validator from 'validator'
import { __Order__ } from '../models/__Order__'

export const validateOrder = (inputs: __Order__) => {
  if (validator.isEmpty(`${inputs.items}`)) {
    return [
      {
        field: 'items',
        message: 'Products to purchase must be selected'
      }
    ]
  }
  if (validator.isEmpty(`${inputs.outletId}`)) {
    return [
      {
        field: 'outletId',
        message: 'Outlet must be selected'
      }
    ]
  }
  if (validator.isEmpty(`${inputs.agentId}`)) {
    return [
      {
        field: 'outletId',
        message: 'Agent is required'
      }
    ]
  }
  if (validator.isEmpty(`${inputs.orderNumber}`)) {
    return [
      {
        field: 'orderNumber',
        message: 'Order number is required'
      }
    ]
  }
  return null
}
