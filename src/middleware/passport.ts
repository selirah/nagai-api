import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { User } from '../entities/User';
import { config } from '../config';
import { PassportStatic } from 'passport';
import { __User__ } from '../models/__User__';

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secretKey,
};

export const passportMiddleware = (passport: PassportStatic) => {
  return passport.use(
    new Strategy(options, (jwtPayload: __User__, done) => {
      User.findOne({ where: { id: jwtPayload.id } })
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
