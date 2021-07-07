import validator from 'validator'
import { __Payment__ } from 'models/__Payment__'

export const validatePayments = (inputs: __Payment__) => {
  if (validator.isEmpty(`${inputs.transactionId}`)) {
    return [
      {
        field: 'transaction',
        message: 'Select the transaction'
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
  if (validator.isEmpty(`${inputs.payer}`)) {
    return [
      {
        field: 'payer',
        message: 'Name of the payer is required'
      }
    ]
  }
  if (validator.isEmpty(inputs.payerPhone)) {
    return [
      {
        field: 'payerPhone',
        message: 'Phone number is required'
      }
    ]
  }
  if (!validator.isLength(inputs.payerPhone, { min: 10, max: 13 })) {
    return [
      {
        field: 'payerPhone',
        message: 'Phone number must be 10 to 13 digits'
      }
    ]
  }

  if (!validator.isMobilePhone(inputs.payerPhone)) {
    return [
      {
        field: 'payerPhone',
        message: 'Phone number must be a valid'
      }
    ]
  }
  return null
}
