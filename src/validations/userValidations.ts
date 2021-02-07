import validator from 'validator';
import { __User__ } from '../models/__User__';
import { __Code__ } from '../models/__Code__';

export const validateRegister = (inputs: __User__) => {
  if (validator.isEmpty(inputs.firstName)) {
    return [
      {
        field: 'firstName',
        message: 'First name is required',
      },
    ];
  }
  if (!validator.isLength(inputs.firstName, { min: 2, max: 20 })) {
    return [
      {
        field: 'firstName',
        message: 'First name must be between 2 and 20 characters',
      },
    ];
  }
  if (validator.isEmpty(inputs.lastName)) {
    return [
      {
        field: 'lastName',
        message: 'Last name is required',
      },
    ];
  }
  if (!validator.isLength(inputs.lastName, { min: 2, max: 20 })) {
    return [
      {
        field: 'lastName',
        message: 'Last name must be between 2 and 20 characters',
      },
    ];
  }
  if (validator.isEmpty(inputs.email)) {
    return [
      {
        field: 'email',
        message: 'Email field is required',
      },
    ];
  }

  if (!validator.isEmail(inputs.email)) {
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
  if (validator.isEmpty(inputs.password)) {
    return [
      {
        field: 'password',
        message: 'Password is required',
      },
    ];
  }
  if (!validator.isLength(inputs.password, { min: 6, max: 30 })) {
    return [
      {
        field: 'password',
        message: 'Pasword must be at least 6 characters',
      },
    ];
  }

  return null;
};

export const alreadyExists = (inputs: __User__, error: any) => {
  if (error.code === '23505' && error.detail.includes('email')) {
    return [
      {
        field: 'email',
        message: `email ${inputs.email} already exists`,
      },
    ];
  }

  if (error.code === '23505' && error.detail.includes('phone')) {
    return [
      {
        field: 'phone',
        message: `phone number ${inputs.phone} already exists`,
      },
    ];
  }
  return null;
};

export const validateVerification = (code: string) => {
  if (validator.isEmpty(code)) {
    return [
      {
        field: 'code',
        message: 'Verification code is required',
      },
    ];
  }
  if (!validator.isLength(code, { min: 6, max: 6 })) {
    return [
      {
        field: 'code',
        message: `Verification code must be 6 digits, you supplied ${code.length}`,
      },
    ];
  }

  return null;
};

export const validateResetPassword = (email: string) => {
  if (validator.isEmpty(email)) {
    return [
      {
        field: 'email',
        message: 'Email field is required',
      },
    ];
  }

  if (!validator.isEmail(email)) {
    return [
      {
        field: 'email',
        message: 'Email is invalid',
      },
    ];
  }

  return null;
};

export const validateLogin = (inputs: __User__) => {
  if (validator.isEmpty(inputs.email)) {
    return [
      {
        field: 'email',
        message: 'Email field is required',
      },
    ];
  }

  if (!validator.isEmail(inputs.email)) {
    return [
      {
        field: 'email',
        message: 'Email is invalid',
      },
    ];
  }

  if (validator.isEmpty(inputs.password)) {
    return [
      {
        field: 'password',
        message: 'Password is required',
      },
    ];
  }

  return null;
};

export const validateAgentAndDispatch = (inputs: __User__) => {
  if (validator.isEmpty(inputs.firstName)) {
    return [
      {
        field: 'firstName',
        message: 'First name is required',
      },
    ];
  }
  if (!validator.isLength(inputs.firstName, { min: 2, max: 20 })) {
    return [
      {
        field: 'firstName',
        message: 'First name must be between 2 and 20 characters',
      },
    ];
  }
  if (validator.isEmpty(inputs.lastName)) {
    return [
      {
        field: 'lastName',
        message: 'Last name is required',
      },
    ];
  }
  if (!validator.isLength(inputs.lastName, { min: 2, max: 20 })) {
    return [
      {
        field: 'lastName',
        message: 'Last name must be between 2 and 20 characters',
      },
    ];
  }
  if (validator.isEmpty(inputs.email)) {
    return [
      {
        field: 'email',
        message: 'Email field is required',
      },
    ];
  }

  if (!validator.isEmail(inputs.email)) {
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
  if (validator.isEmpty(inputs.role)) {
    return [
      {
        field: 'role',
        message: 'Role of user is required',
      },
    ];
  }
  return null;
};
