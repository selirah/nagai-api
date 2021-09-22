import validator from 'validator'
import { __Invoice__ } from '../models/__Invoice__'

export const validateInvoice = (inputs: __Invoice__) => {
  if (validator.isEmpty(`${inputs.orderId}`)) {
    return [
      {
        field: 'orderId',
        message: 'Order ID is required'
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
