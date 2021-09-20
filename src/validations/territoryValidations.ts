import validator from 'validator'
import { __Territory__ } from '../models/__Territory__'

export const validateTerritory = (inputs: __Territory__) => {
  if (validator.isEmpty(inputs.locality)) {
    return [
      {
        field: 'locality',
        message: 'Locality name of territory is required'
      }
    ]
  }

  if (!validator.isLength(inputs.locality, { min: 2 })) {
    return [
      {
        field: 'locality',
        message: 'Locality name must have a minimum of 2 characters'
      }
    ]
  }

  return null
}
