import validator from 'validator'
import { __Product__ } from 'models/__Product__'

export const validateProduct = (inputs: __Product__) => {
  if (validator.isEmpty(inputs.productName)) {
    return [
      {
        field: 'name',
        message: 'Product name is required'
      }
    ]
  }

  if (!validator.isLength(inputs.productName, { min: 2 })) {
    return [
      {
        field: 'name',
        message: 'Name must have a minimum of 2 characters'
      }
    ]
  }

  if (validator.isEmpty(`${inputs.categoryId}`)) {
    return [
      {
        field: 'name',
        message: 'Category of product is required'
      }
    ]
  }

  if (validator.isEmpty(`${inputs.manufacturerId}`)) {
    return [
      {
        field: 'name',
        message: 'Product manufacturer is required'
      }
    ]
  }

  return null
}
