import validator from 'validator'
import { __UserTerritory__ } from '../models/__UserTerritory__'
import { isEmpty } from './isEmpty'

export const validateUserTerritory = (inputs: __UserTerritory__) => {
  if (validator.isEmpty(`${inputs.userId}`)) {
    return [
      {
        field: 'user',
        message: 'User is required'
      }
    ]
  }

  if (validator.isEmpty(`${inputs.territories}`)) {
    return [
      {
        field: 'territories',
        message: 'Add a user territory'
      }
    ]
  }

  if (
    !validator.isEmpty(`${inputs.territories}`) &&
    isEmpty(inputs.territories)
  ) {
    return [
      {
        field: 'territories',
        message: 'At least one territory must be selected'
      }
    ]
  }
  return null
}
