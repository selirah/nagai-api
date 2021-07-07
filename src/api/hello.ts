import { router } from 'utils'
import { Request, Response } from 'express'
import passport from 'passport'

router.get(
  '/hello',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    return res.status(200).json({ message: req.user })
  }
)

export { router as hello }
