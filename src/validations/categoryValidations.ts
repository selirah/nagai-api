import validator from 'validator'
import { __Category__ } from '../models/__Category__'

export const validateCategory = (inputs: __Category__) => {
  if (validator.isEmpty(inputs.category)) {
    return [
      {
        field: 'name',
        message: 'Name of category is required'
      }
    ]
  }
  if (!validator.isLength(inputs.category, { min: 2 })) {
    return [
      {
        field: 'name',
        message: 'Name must have a minimum of 2 characters'
      }
    ]
  }
  return null
}
