import validator from 'validator'
import { __Outlet__ } from '../models/__Outlet__'

export const validateClient = (inputs: __Outlet__) => {
  if (validator.isEmpty(inputs.ownerName)) {
    return [
      {
        field: 'ownerName',
        message: 'Owner Name is required'
      }
    ]
  }

  if (!validator.isLength(inputs.ownerName, { min: 2 })) {
    return [
      {
        field: 'ownerName',
        message: 'Owner name must have a minimum of 2 characters'
      }
    ]
  }

  if (validator.isEmpty(inputs.outletName)) {
    return [
      {
        field: 'outletName',
        message: 'Outlet Name is required'
      }
    ]
  }

  if (!validator.isLength(inputs.outletName, { min: 2 })) {
    return [
      {
        field: 'outletName',
        message: 'Outlet name must have a minimum of 2 characters'
      }
    ]
  }

  if (!validator.isEmpty(inputs.email) && !validator.isEmail(inputs.email)) {
    return [
      {
        field: 'email',
        message: 'Email is invalid'
      }
    ]
  }

  if (
    !validator.isEmpty(inputs.mobile) &&
    !validator.isLength(inputs.mobile, { min: 10, max: 13 })
  ) {
    return [
      {
        field: 'mobile',
        message: 'Mobile number must be 10 to 13 digits'
      }
    ]
  }

  if (validator.isEmpty(inputs.locality)) {
    return [
      {
        field: 'locality',
        message: 'Locality is required'
      }
    ]
  }

  if (validator.isEmpty(inputs.subLocality)) {
    return [
      {
        field: 'subLocality',
        message: 'Sub-locality is required'
      }
    ]
  }

  if (validator.isEmpty(inputs.barcode)) {
    return [
      {
        field: 'barcode',
        message: 'Barcode is required'
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

  if (validator.isEmpty(`${inputs.territoryId}`)) {
    return [
      {
        field: 'territoryId',
        message: 'Territory is required'
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

  return null
}
