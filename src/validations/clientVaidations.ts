import validator from 'validator'
import { __Client__ } from '../models/__Client__'

export const validateClient = (inputs: __Client__) => {
  if (validator.isEmpty(inputs.businessName)) {
    return [
      {
        field: 'businessName',
        message: 'Business Name of client is required'
      }
    ]
  }

  if (!validator.isLength(inputs.businessName, { min: 2 })) {
    return [
      {
        field: 'businessName',
        message: 'Business name must have a minimum of 2 characters'
      }
    ]
  }

  if (validator.isEmpty(inputs.businessEmail)) {
    return [
      {
        field: 'businessEmail',
        message: 'Business Email of client is required'
      }
    ]
  }

  if (!validator.isEmail(inputs.businessEmail)) {
    return [
      {
        field: 'email',
        message: 'Business Email is invalid'
      }
    ]
  }

  if (validator.isEmpty(inputs.phoneNumber)) {
    return [
      {
        field: 'phone',
        message: 'Phone number is required'
      }
    ]
  }
  if (!validator.isLength(inputs.phoneNumber, { min: 10, max: 13 })) {
    return [
      {
        field: 'phone',
        message: 'Phone number must be 10 to 13 digits'
      }
    ]
  }

  if (!validator.isMobilePhone(inputs.phoneNumber)) {
    return [
      {
        field: 'phone',
        message: 'Phone number must be a valid'
      }
    ]
  }

  if (
    !validator.isEmpty(`${inputs.coordinates.lat}`) &&
    !validator.isFloat(`${inputs.coordinates.lat}`)
  ) {
    return [
      {
        field: 'lat',
        message: 'Latitude must be valid'
      }
    ]
  }

  if (
    !validator.isEmpty(`${inputs.coordinates.lng}`) &&
    !validator.isFloat(`${inputs.coordinates.lng}`)
  ) {
    return [
      {
        field: 'lng',
        message: 'Longitude must be valid'
      }
    ]
  }

  if (!validator.isBase64(inputs.logo)) {
    return [
      {
        field: 'logo',
        message: 'Wrong image format'
      }
    ]
  }

  if (validator.isEmpty(`${inputs.cityId}`)) {
    return [
      {
        field: 'city',
        message: 'City is requried'
      }
    ]
  }

  if (validator.isEmpty(inputs.location)) {
    return [
      {
        field: 'location',
        message: 'Location of manufacturer is requried'
      }
    ]
  }

  if (validator.isEmpty(`${inputs.territoryId}`)) {
    return [
      {
        field: 'territory',
        message: 'Territory is requried'
      }
    ]
  }

  return null
}
