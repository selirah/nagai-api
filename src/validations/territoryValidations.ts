import validator from 'validator';
import { __Territory__ } from '../models/__Territory__';

export const validateTerritory = (inputs: __Territory__) => {
  if (validator.isEmpty(inputs.territoryName)) {
    return [
      {
        field: 'territoryName',
        message: 'Name of territory is required',
      },
    ];
  }

  if (!validator.isLength(inputs.territoryName, { min: 2 })) {
    return [
      {
        field: 'territoryName',
        message: 'Territory name must have a minimum of 2 characters',
      },
    ];
  }

  if (validator.isEmpty(`${inputs.coordinates.lat}`)) {
    return [
      {
        field: 'lat',
        message: 'Latitude of territory is required',
      },
    ];
  }

  if (!validator.isFloat(`${inputs.coordinates.lat}`)) {
    return [
      {
        field: 'lat',
        message: 'Latitude must be valid',
      },
    ];
  }

  if (validator.isEmpty(`${inputs.coordinates.lng}`)) {
    return [
      {
        field: 'lng',
        message: 'Longitude of territory is required',
      },
    ];
  }

  if (!validator.isFloat(`${inputs.coordinates.lng}`)) {
    return [
      {
        field: 'lng',
        message: 'Longitude must be valid',
      },
    ];
  }

  return null;
};
