import passport from 'passport';

export const authorization = passport.authenticate('jwt', { session: false });
