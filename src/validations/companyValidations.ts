import validator from 'validator'
import { __Company__ } from '../models/__Company__'

export const validateCompany = (inputs: __Company__) => {
  if (validator.isEmpty(inputs.name)) {
    return [
      {
        field: 'name',
        message: 'Name of company is required'
      }
    ]
  }

  if (!validator.isLength(inputs.name, { min: 2 })) {
    return [
      {
        field: 'name',
        message: 'Name must have a minimum of 2 characters'
      }
    ]
  }

  if (validator.isEmpty(inputs.email)) {
    return [
      {
        field: 'email',
        message: 'Email field is required'
      }
    ]
  }

  if (!validator.isEmail(inputs.email)) {
    return [
      {
        field: 'email',
        message: 'Email is invalid'
      }
    ]
  }

  if (validator.isEmpty(inputs.phone)) {
    return [
      {
        field: 'phone',
        message: 'Phone number is required'
      }
    ]
  }
  if (!validator.isLength(inputs.phone, { min: 10, max: 13 })) {
    return [
      {
        field: 'phone',
        message: 'Phone number must be 10 to 13 digits'
      }
    ]
  }

  if (validator.isEmpty(inputs.smsID)) {
    return [
      {
        field: 'smsID',
        message: 'SMS ID of company is required'
      }
    ]
  }

  if (!validator.isLength(inputs.smsID, { max: 11 })) {
    return [
      {
        field: 'smsID',
        message: 'SMS ID must have a maximum of 11 characters'
      }
    ]
  }

  return null
}
