import validator from 'validator'
import { __Stock__ } from '../models/__Stock__'

export const validateStock = (inputs: __Stock__) => {
  if (validator.isEmpty(`${inputs.productId}`)) {
    return [
      {
        field: 'product',
        message: 'You must select a product'
      }
    ]
  }

  if (validator.isEmpty(`${inputs.sku}`)) {
    return [
      {
        field: 'sku',
        message: 'You must add the product sku'
      }
    ]
  }

  if (validator.isEmpty(`${inputs.unit}`)) {
    return [
      {
        field: 'unit',
        message: 'You must include the unit of the product'
      }
    ]
  }

  if (validator.isEmpty(`${inputs.unitPrice}`)) {
    return [
      {
        field: 'unitPrice',
        message: 'Unit price field is required'
      }
    ]
  }

  if (validator.isEmpty(`${inputs.quantityPurchased}`)) {
    return [
      {
        field: 'quantityPurchased',
        message: 'Quantity purchased field is required'
      }
    ]
  }

  if (validator.isEmpty(`${inputs.quantityInStock}`)) {
    return [
      {
        field: 'quantityInStock',
        message: 'Quantity field is required'
      }
    ]
  }

  if (validator.isEmpty(`${inputs.reorderLevel}`)) {
    return [
      {
        field: 'reorderLevel',
        message: 'Reorder level is required'
      }
    ]
  }

  if (validator.isEmpty(`${inputs.reorderQuantity}`)) {
    return [
      {
        field: 'reorderQuantity',
        message: 'Reorder quantity is required'
      }
    ]
  }

  if (validator.isEmpty(`${inputs.reorderDate}`)) {
    return [
      {
        field: 'reorderDate',
        message: 'Reorder date is required'
      }
    ]
  }
  return null
}

export const productExists = (inputs: __Stock__, error: any) => {
  if (error.code === '23505' && error.detail.includes('sku')) {
    return [
      {
        field: 'sku',
        message: `Product with sku ${inputs.sku} stock exists. You can only update it`
      }
    ]
  }
  return null
}
