import validator from 'validator'
import { __Delivery__ } from 'models/__Delivery__'

export const validateDelivery = (inputs: __Delivery__) => {
  if (validator.isEmpty(`${inputs.orderId}`)) {
    return [
      {
        field: 'order',
        message: 'You must select the order'
      }
    ]
  }

  if (validator.isEmpty(`${inputs.dispatchId}`)) {
    return [
      {
        field: 'dispatch',
        message: 'You must select the dispatch rider'
      }
    ]
  }

  return null
}
