import { router, sendEmail, sendSMS, jwtToken } from '../utils'
import { Request, Response } from 'express'
import { authorization } from '../middleware/auth'
import { User, UserRole } from '../entities/User'
import { Code } from '../entities/Code'
import {
  validateRegister,
  alreadyExists,
  validateVerification,
  validateResetPassword,
  validateLogin,
  validateAgentAndDispatch,
  validateChangePassword
} from '../validations'
import { __User__, __ChangePassword__ } from '../models/__User__'
import { __Code__ } from '../models/__Code__'
import argon2 from 'argon2'
import { getConnection, Brackets } from 'typeorm'
import moment from 'moment'
import { isEmpty } from '../validations/isEmpty'
import { generateRandomNumbers, sanitizePhone } from '../helper/functions'

router.post('/users/register', async (req: Request, res: Response) => {
  const options: __User__ = req.body
  const errors = validateRegister(options)
  if (errors) {
    return res.status(400).json({ errors })
  }

  const hashedPassword = await argon2.hash(options.password)
  let user: __User__ | undefined
  try {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        email: options.email,
        password: hashedPassword,
        phone: sanitizePhone(options.phone),
        role: !isEmpty(options.role)
          ? options.role.toLowerCase()
          : UserRole.ADMIN
      })
      .returning('*')
      .execute()
    user = result.raw[0]
    // send code to user on sms and email
    const code = generateRandomNumbers()
    const expiry = new Date(moment().add(24, 'hours').toDate())
    const saveCode = await Code.create({
      user: user,
      code: code,
      expiryDate: expiry
    }).save()
    if (saveCode) {
      const emailMessage = `<h2>Use this code ${code} to verify your account. It will expire in 24 hours time</h2>`
      const smsMessage = `Use this code ${code} to verify your account. It will expire in 24 hours time`
      await sendEmail(options.email, emailMessage)
      await sendSMS(options.phone, smsMessage)
    }
  } catch (err) {
    const errors = alreadyExists(options, err)
    if (errors) {
      return res.status(400).json({ errors })
    }
  }
  return res.status(201).json(user)
})

router.post('/users/verify', async (req: Request, res: Response) => {
  const options: string = req.body.code
  const errors = validateVerification(options)
  if (errors) {
    return res.status(400).json({ errors })
  }
  const code = await Code.findOne({ where: { code: options } })
  if (!code) {
    const errors = [
      {
        field: 'code',
        message: `The code ${options} does not exist`
      }
    ]
    return res.status(404).json({ errors })
  }
  const today = new Date()
  const { expiryDate } = code
  const user = await User.findOne({ where: { id: code.userId } })

  if (today.getTime() > expiryDate.getTime()) {
    const errors = [
      {
        field: 'code',
        message: `The code ${options} has expired.`
      }
    ]
    return res.status(404).json({ errors })
  }
  // successful so update user and set verification to true
  await User.update({ id: code.userId }, { isVerified: true })
  const emailMessage = `<h2>Your account has successfully been verified. If you are not the one who verified. Contact support</h2>`
  await sendEmail(user!.email, emailMessage)
  return res.sendStatus(200)
})

router.post('/users/resend-code', async (req: Request, res: Response) => {
  const options: string = req.body.email
  const errors = validateResetPassword(options)
  if (errors) {
    return res.status(400).json({ errors })
  }
  const user = await User.findOne({ where: { email: options } })
  if (!user) {
    // const errors = [
    //   {
    //     field: 'email',
    //     message: `Account with email ${options} provided does not exist`,
    //   },
    // ];
    // for security reasons, let's pretend user email was correct
    return res.sendStatus(200)
  }
  const pin = generateRandomNumbers()
  const code = await Code.findOne({ where: { userId: user.id } })
  if (!code) {
    const expiry = new Date(moment().add(24, 'hours').toDate())
    Code.create({ code: pin, expiryDate: expiry, user: user })

    const emailMessage = `<h2>Use this code ${pin} to verify your account. It will expire in 24 hours time</h2>`
    const smsMessage = `Use this code ${pin} to verify your account. It will expire in 24 hours time`
    await sendEmail(user!.email, emailMessage)
    await sendSMS(user!.phone, smsMessage)
    return res.sendStatus(200)
  }
  const expiry = new Date(moment().add(24, 'hours').toDate())
  await Code.update({ id: code.id }, { code: pin, expiryDate: expiry })

  const emailMessage = `<h2>Use this code ${pin} to verify your account. It will expire in 24 hours time</h2>`
  const smsMessage = `Use this code ${pin} to verify your account. It will expire in 24 hours time`
  await sendEmail(user!.email, emailMessage)
  await sendSMS(user!.phone, smsMessage)

  return res.sendStatus(200)
})

router.post('/users/reset-password', async (req: Request, res: Response) => {
  const options: string = req.body.email
  const errors = validateResetPassword(options)
  if (errors) {
    return res.status(400).json({ errors })
  }
  const user = await User.findOne({ where: { email: options } })
  if (!user) {
    // const errors = [
    //   {
    //     field: 'email',
    //     message: `Account with email ${options} not found`,
    //   },
    // ];
    return res.sendStatus(200)
  }

  const password = generateRandomNumbers()
  // const password = 'pass123'
  const hashedPassword = await argon2.hash(`${password}`)
  const update = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ password: hashedPassword })
    .where('id = :id', { id: user.id })
    .execute()

  if (update.affected !== 1) {
    const errors = [
      {
        field: 'email',
        message: 'An error occured. Please try again later'
      }
    ]
    return res.status(500).json({ errors })
  }
  const emailMessage = `<h2>Use this code ${password} to log into your account and change</h2>`
  const smsMessage = `Use this code ${password} to log into your account and change`
  await sendEmail(user.email, emailMessage)
  await sendSMS(user.phone, smsMessage)
  return res.sendStatus(200)
})

router.post('/users/login', async (req: Request, res: Response) => {
  const options: __User__ = req.body
  const errors = validateLogin(options)
  if (errors) {
    return res.status(400).json({ errors })
  }

  const user = await User.findOne({ where: { email: options.email } })
  if (!user) {
    const errors = [
      {
        field: 'email',
        message: 'Invalid credentials'
      }
    ]
    return res.status(401).json({ errors })
  }
  const valid = await argon2.verify(user.password, options.password)
  if (!valid) {
    const errors = [
      {
        field: 'password',
        message: 'Invalid credentials'
      }
    ]
    return res.status(401).json({ errors })
  }
  if (!user.isVerified) {
    const errors = [
      {
        field: 'email',
        message: 'Account not verified'
      }
    ]
    return res.status(401).json({ errors })
  }

  // log user in
  const token = jwtToken(user)
  return res.status(200).json({ token })
})

router.post('/users', authorization, async (req: Request, res: Response) => {
  const inputs: __User__ = req.body
  const errors = validateAgentAndDispatch(inputs)

  if (errors) {
    return res.status(400).json({ errors })
  }

  const password = generateRandomNumbers()
  const hashedPassword = await argon2.hash(`${password}`)

  try {
    const queryResult = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        firstName: inputs.firstName.toLowerCase(),
        lastName: inputs.lastName.toLowerCase(),
        email: inputs.email,
        password: hashedPassword,
        phone: sanitizePhone(inputs.phone),
        isVerified: inputs.isVerified,
        role: inputs.role.toLowerCase()
      })
      .returning('*')
      .execute()
    if (!queryResult.raw[0]) {
      return res.sendStatus(500)
    }
    // send code to user on sms and email
    const emailMessage = `<h2>Use this temporal password ${password} to login your account</h2>`
    const smsMessage = `Use this temporal password ${password} to login your account`
    await sendEmail(inputs.email, emailMessage)
    await sendSMS(inputs.phone, smsMessage)
  } catch (err) {
    const errors = alreadyExists(inputs, err)
    if (errors) {
      return res.status(400).json({ errors })
    }
  }
  return res.sendStatus(201)
})

router.put('/users/:id', authorization, async (req: Request, res: Response) => {
  const inputs: __User__ = req.body
  const errors = validateAgentAndDispatch(inputs)
  const userId: number = parseInt(req.params.id)

  if (errors) {
    return res.status(400).json({ errors })
  }

  try {
    const queryResult = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({
        firstName: inputs.firstName.toLowerCase(),
        lastName: inputs.lastName.toLowerCase(),
        email: inputs.email,
        phone: sanitizePhone(inputs.phone),
        isVerified: inputs.isVerified,
        role: inputs.role.toLowerCase(),
        avatar: inputs.avatar
      })
      .where('id = :id', {
        id: userId
      })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    return res.sendStatus(200)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

router.get('/users', authorization, async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? +req.query.page : 10
  const skip = req.query.skip !== undefined ? +req.query.skip : 0
  const role = req.query.role !== undefined ? req.query.role : ''
  const query = req.query.query
  try {
    if (!isEmpty(role)) {
      const [users, count] = await getConnection()
        .getRepository(User)
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.userTerritories', 'userTerritories')
        .where('users."role" = :role', {
          role: role
        })
        .andWhere(
          new Brackets((sqb) => {
            sqb.where('users."firstName" like :query', {
              query: `%${query?.toString().toLowerCase()}%`
            })
            sqb.orWhere('users."lastName" like :query', {
              query: `%${query?.toString().toLowerCase()}%`
            })
            sqb.orWhere('users."email" like :query', {
              query: `%${query?.toString()}%`
            })
            sqb.orWhere('users."phone" like :query', {
              query: `%${query?.toString()}%`
            })
          })
        )
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ users, count })
    } else {
      const [users, count] = await getConnection()
        .getRepository(User)
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.userTerritories', 'userTerritories')
        .where('users."firstName" like :query', {
          query: `%${query?.toString().toLowerCase()}%`
        })
        .orWhere('users."lastName" like :query', {
          query: `%${query?.toString().toLowerCase()}%`
        })
        .orWhere('users."email" like :query', {
          query: `%${query?.toString()}%`
        })
        .orWhere('users."phone" like :query', {
          query: `%${query?.toString()}%`
        })
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ users, count })
    }
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

router.get('/user/:id', authorization, async (req: Request, res: Response) => {
  const userId: number = parseInt(req.params.id)

  try {
    const user = await getConnection()
      .getRepository(User)
      .createQueryBuilder('users')
      .where('users."id" = :id', {
        id: userId
      })
      .getOne()
    return res.status(200).json(user)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

router.delete(
  '/users/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id)

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('"id" = :id', {
          id: id
        })
        .execute()

      if (queryResult.affected !== 1) {
        return res.sendStatus(500)
      }
    } catch (err) {
      console.log(err)
    }
    return res.sendStatus(200)
  }
)

router.post(
  '/users/bulk',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __User__[] = req.body
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(inputs)
        .execute()

      return res.sendStatus(201)
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
)

router.post('/user/change-password', async (req: Request, res: Response) => {
  const options: __ChangePassword__ = req.body
  const errors = validateChangePassword(options)
  if (errors) {
    return res.status(400).json({ errors })
  }

  const user = await User.findOne({ where: { id: options.id } })
  if (!user) {
    const errors = [
      {
        field: 'user',
        message: 'System Error'
      }
    ]
    return res.status(401).json({ errors })
  }
  const valid = await argon2.verify(user.password, options.oldPassword)
  if (!valid) {
    const errors = [
      {
        field: 'password',
        message: 'Your old password is invalid'
      }
    ]
    return res.status(401).json({ errors })
  }
  const hashedPassword = await argon2.hash(options.newPassword)
  try {
    const queryResult = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({
        password: hashedPassword
      })
      .where('id = :id', {
        id: options.id
      })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    return res.sendStatus(200)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

export { router as users }
