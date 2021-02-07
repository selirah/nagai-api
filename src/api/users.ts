import { router, sendEmail, sendSMS, jwtToken } from '../utils';
import { Request, Response } from 'express';
import { authorization } from '../middleware/auth';
import { User, UserRole } from '../entities/User';
import { Code } from '../entities/Code';
import {
  validateRegister,
  alreadyExists,
  validateVerification,
  validateResetPassword,
  validateLogin,
  validateAgentAndDispatch,
} from '../validations';
import { __User__ } from '../models/__User__';
import { __Code__ } from '../models/__Code__';
import argon2 from 'argon2';
import { getConnection } from 'typeorm';
import moment from 'moment';
import { isEmpty } from '../validations/isEmpty';

router.post('/users/register', async (req: Request, res: Response) => {
  const options: __User__ = req.body;
  const errors = validateRegister(options);
  if (errors) {
    return res.status(400).json({ errors });
  }

  const hashedPassword = await argon2.hash(options.password);
  let user: __User__ | undefined;
  try {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        firstName: options.firstName,
        lastName: options.lastName,
        email: options.email,
        password: hashedPassword,
        phone: options.phone,
        role: !isEmpty(options.role)
          ? options.role.toLocaleLowerCase()
          : UserRole.ADMIN,
      })
      .returning('*')
      .execute();
    user = result.raw[0];
    // send code to user on sms and email
    const code = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date(moment().add(24, 'hours').toDate());
    const saveCode = await Code.create({
      user: user,
      code: code,
      expiryDate: expiry,
    }).save();
    if (saveCode) {
      const emailMessage = `<h2>Use this code ${code} to verify your account. It will expire in 24 hours time</h2>`;
      const smsMessage = `Use this code ${code} to verify your account. It will expire in 24 hours time`;
      await sendEmail(options.email, emailMessage);
      await sendSMS(options.phone, smsMessage);
    }
  } catch (err) {
    const errors = alreadyExists(options, err);
    if (errors) {
      return res.status(400).json({ errors });
    }
  }
  return res.status(201).json(user);
});

router.post('/users/verify', async (req: Request, res: Response) => {
  const options: string = req.body.code;
  const errors = validateVerification(options);
  if (errors) {
    return res.status(400).json({ errors });
  }
  const code = await Code.findOne({ where: { code: options } });
  if (!code) {
    const errors = [
      {
        field: 'code',
        message: `The code ${options} does not exist`,
      },
    ];
    return res.status(404).json({ errors });
  }
  const today = new Date();
  const { expiryDate } = code;
  const user = await User.findOne({ where: { id: code.userId } });

  if (today.getTime() > expiryDate.getTime()) {
    const errors = [
      {
        field: 'code',
        message: `The code ${options} has expired.`,
      },
    ];
    return res.status(404).json({ errors });
  }
  // successful so update user and set verification to true
  await User.update({ id: code.userId }, { isVerified: true });
  const emailMessage = `<h2>Your account has successfully been verified. If you are not the one who verified. Contact support</h2>`;
  await sendEmail(user!.email, emailMessage);
  return res.sendStatus(200);
});

router.post('/users/resend-code', async (req: Request, res: Response) => {
  const options: string = req.body.email;
  const errors = validateResetPassword(options);
  if (errors) {
    return res.status(400).json({ errors });
  }
  const user = await User.findOne({ where: { email: options } });
  if (!user) {
    // const errors = [
    //   {
    //     field: 'email',
    //     message: `Account with email ${options} provided does not exist`,
    //   },
    // ];
    // for security reasons, let's pretend user email was correct
    return res.sendStatus(200);
  }
  const pin = Math.floor(100000 + Math.random() * 900000);
  const code = await Code.findOne({ where: { userId: user.id } });
  if (!code) {
    const expiry = new Date(moment().add(24, 'hours').toDate());
    Code.create({ code: pin, expiryDate: expiry, user: user });

    const emailMessage = `<h2>Use this code ${pin} to verify your account. It will expire in 24 hours time</h2>`;
    const smsMessage = `Use this code ${pin} to verify your account. It will expire in 24 hours time`;
    await sendEmail(user!.email, emailMessage);
    await sendSMS(user!.phone, smsMessage);
    return res.sendStatus(200);
  }
  const expiry = new Date(moment().add(24, 'hours').toDate());
  await Code.update({ id: code.id }, { code: pin, expiryDate: expiry });

  const emailMessage = `<h2>Use this code ${pin} to verify your account. It will expire in 24 hours time</h2>`;
  const smsMessage = `Use this code ${pin} to verify your account. It will expire in 24 hours time`;
  await sendEmail(user!.email, emailMessage);
  await sendSMS(user!.phone, smsMessage);

  return res.sendStatus(200);
});

router.post('/users/reset-password', async (req: Request, res: Response) => {
  const options: string = req.body.email;
  const errors = validateResetPassword(options);
  if (errors) {
    return res.status(400).json({ errors });
  }
  const user = await User.findOne({ where: { email: options } });
  if (!user) {
    // const errors = [
    //   {
    //     field: 'email',
    //     message: `Account with email ${options} not found`,
    //   },
    // ];
    return res.sendStatus(200);
  }

  const password = Math.floor(100000 + Math.random() * 900000);
  // const password = 'pass123'
  const hashedPassword = await argon2.hash(`${password}`);
  const update = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ password: hashedPassword })
    .where('id = :id', { id: user.id })
    .execute();

  if (update.affected !== 1) {
    const errors = [
      {
        field: 'email',
        message: 'An error occured. Please try again later',
      },
    ];
    return res.status(500).json({ errors });
  }
  const emailMessage = `<h2>Use this code ${password} to log into your account and change</h2>`;
  const smsMessage = `Use this code ${password} to log into your account and change`;
  await sendEmail(user.email, emailMessage);
  await sendSMS(user.phone, smsMessage);
  return res.sendStatus(200);
});

router.post('/users/login', async (req: Request, res: Response) => {
  const options: __User__ = req.body;
  const errors = validateLogin(options);
  if (errors) {
    return res.status(400).json({ errors });
  }

  const user = await User.findOne({ where: { email: options.email } });
  if (!user) {
    const errors = [
      {
        field: 'email',
        message: 'Invalid credentials',
      },
    ];
    return res.status(401).json({ errors });
  }
  const valid = await argon2.verify(user.password, options.password);
  if (!valid) {
    const errors = [
      {
        field: 'password',
        message: 'Invalid credentials',
      },
    ];
    return res.status(401).json({ errors });
  }
  if (!user.isVerified) {
    const errors = [
      {
        field: 'email',
        message: 'Account not verified',
      },
    ];
    return res.status(401).json({ errors });
  }

  // log user in
  const token = jwtToken(user);
  return res.status(200).json({ token });
});

router.post('/users', authorization, async (req: Request, res: Response) => {
  const inputs: __User__ = req.body;
  const errors = validateAgentAndDispatch(inputs);

  if (errors) {
    return res.status(400).json({ errors });
  }

  const password = Math.floor(100000 + Math.random() * 900000);
  const hashedPassword = await argon2.hash(`${password}`);

  let user: __User__ | undefined;
  try {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        password: hashedPassword,
        phone: inputs.phone,
        isVerified: true,
        role: inputs.role.toLocaleLowerCase(),
      })
      .returning('*')
      .execute();
    user = result.raw[0];
    // send code to user on sms and email
    const emailMessage = `<h2>Use this temporal password ${password} to login your account</h2>`;
    const smsMessage = `Use this temporal password ${password} to login your account`;
    await sendEmail(inputs.email, emailMessage);
    await sendSMS(inputs.phone, smsMessage);
  } catch (err) {
    const errors = alreadyExists(inputs, err);
    if (errors) {
      return res.status(400).json({ errors });
    }
  }
  return res.status(201).json(user);
});

router.put('/users/:id', authorization, async (req: Request, res: Response) => {
  const inputs: __User__ = req.body;
  const errors = validateAgentAndDispatch(inputs);
  const userId: number = parseInt(req.params.id);

  if (errors) {
    return res.status(400).json({ errors });
  }

  const queryResult = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({
      firstName: inputs.firstName,
      lastName: inputs.lastName,
      email: inputs.email,
      phone: inputs.phone,
      isVerified: true,
      role: inputs.role.toLocaleLowerCase(),
      avatar: inputs.avatar,
    })
    .where('id = :id', {
      id: userId,
    })
    .execute();

  if (queryResult.affected !== 1) {
    return res.sendStatus(500);
  }
  const user = await getConnection()
    .getRepository(User)
    .createQueryBuilder('user')
    .where('id = :id', {
      id: userId,
    })
    .getOne();

  return res.status(200).json(user);
});

router.get('/users', async (_: Request, res: Response) => {
  const users = await getConnection()
    .getRepository(User)
    .createQueryBuilder('users')
    .where('role != :role', {
      role: UserRole.ADMIN,
    })
    .getMany();

  return res.status(200).json(users);
});

router.get('/users/:id', async (req: Request, res: Response) => {
  const userId: number = parseInt(req.params.id);

  const user = await getConnection()
    .getRepository(User)
    .createQueryBuilder('user')
    .where('id = :id', {
      id: userId,
    })
    .getOne();

  return res.status(200).json(user);
});

export { router as users };
