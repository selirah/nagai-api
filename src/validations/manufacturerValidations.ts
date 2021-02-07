import validator from 'validator';
import { __Manufacturer__ } from '../models/__Manufacturer__';

export const validateManufacturer = (inputs: __Manufacturer__) => {
  if (validator.isEmpty(inputs.name)) {
    return [
      {
        field: 'name',
        message: 'Name of manufacturer is required',
      },
    ];
  }

  if (!validator.isLength(inputs.name, { min: 2 })) {
    return [
      {
        field: 'name',
        message: 'Name must have a minimum of 2 characters',
      },
    ];
  }

  if (!validator.isEmpty(inputs.email) && !validator.isEmail(inputs.email)) {
    return [
      {
        field: 'email',
        message: 'Email is invalid',
      },
    ];
  }

  if (validator.isEmpty(inputs.phone)) {
    return [
      {
        field: 'phone',
        message: 'Phone number is required',
      },
    ];
  }
  if (!validator.isLength(inputs.phone, { min: 10, max: 13 })) {
    return [
      {
        field: 'phone',
        message: 'Phone number must be 10 to 13 digits',
      },
    ];
  }

  if (!validator.isMobilePhone(inputs.phone)) {
    return [
      {
        field: 'phone',
        message: 'Phone number must be a valid',
      },
    ];
  }

  if (
    !validator.isEmpty(`${inputs.coordinates.lat}`) &&
    !validator.isFloat(`${inputs.coordinates.lat}`)
  ) {
    return [
      {
        field: 'lat',
        message: 'Latitude must be valid',
      },
    ];
  }

  if (
    !validator.isEmpty(`${inputs.coordinates.lng}`) &&
    !validator.isFloat(`${inputs.coordinates.lng}`)
  ) {
    return [
      {
        field: 'lng',
        message: 'Longitude must be valid',
      },
    ];
  }

  if (!validator.isBase64(inputs.logo)) {
    return [
      {
        field: 'logo',
        message: 'Wrong image format',
      },
    ];
  }

  if (validator.isEmpty(`${inputs.cityId}`)) {
    return [
      {
        field: 'city',
        message: 'City is requried',
      },
    ];
  }

  if (validator.isEmpty(inputs.location)) {
    return [
      {
        field: 'location',
        message: 'Location of manufacturer is requried',
      },
    ];
  }

  return null;
};
