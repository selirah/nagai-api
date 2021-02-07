import validator from 'validator';
import { __Inventory__ } from '../models/__Inventory__';

export const validateInventory = (inputs: __Inventory__) => {
  if (validator.isEmpty(`${inputs.productId}`)) {
    return [
      {
        field: 'product',
        message: 'You must select a product',
      },
    ];
  }

  if (validator.isEmpty(`${inputs.unit}`)) {
    return [
      {
        field: 'unit',
        message: 'You must include the unit of the product',
      },
    ];
  }

  if (validator.isEmpty(`${inputs.unitPrice}`)) {
    return [
      {
        field: 'unitPrice',
        message: 'Unit price field is required',
      },
    ];
  }

  if (validator.isEmpty(`${inputs.quantityInStock}`)) {
    return [
      {
        field: 'quantityInStock',
        message: 'Quantity field is required',
      },
    ];
  }

  if (validator.isEmpty(`${inputs.reorderLevel}`)) {
    return [
      {
        field: 'reorderLevel',
        message: 'Reorder level is required',
      },
    ];
  }

  if (validator.isEmpty(`${inputs.reorderQuantity}`)) {
    return [
      {
        field: 'reorderQuantity',
        message: 'Reorder quantity is required',
      },
    ];
  }

  if (validator.isEmpty(`${inputs.reorderDate}`)) {
    return [
      {
        field: 'reorderDate',
        message: 'Reorder date is required',
      },
    ];
  }
  return null;
};

export const productExists = (inputs: __Inventory__, error: any) => {
  if (error.code === '23505' && error.detail.includes('productId')) {
    return [
      {
        field: 'product',
        message: `Product with ${inputs.productId} inventory exists. You can only update it`,
      },
    ];
  }
  return null;
};
