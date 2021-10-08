import validator from 'validator'
import { __Sale__ } from '../models/__Sale__'

export const validateSale = (inputs: __Sale__) => {
  if (validator.isEmpty(`${inputs.orderId}`)) {
    return [
      {
        field: 'order',
        message: 'Order field is required'
      }
    ]
  }
  if (validator.isEmpty(`${inputs.invoiceId}`)) {
    return [
      {
        field: 'invoice',
        message: 'Invoice field is required'
      }
    ]
  }
  if (validator.isEmpty(`${inputs.amount}`)) {
    return [
      {
        field: 'amount',
        message: 'Amount field is required'
      }
    ]
  }
  if (validator.isEmpty(`${inputs.amountPaid}`)) {
    return [
      {
        field: 'amountPaid',
        message: 'Amount paid is required'
      }
    ]
  }
  return null
}
