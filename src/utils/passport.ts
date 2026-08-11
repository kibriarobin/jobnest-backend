
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../lib/prisma';
import config from '../config';

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google_client_id as string,
      clientSecret: config.google_client_secret as string,
      callbackURL: config.google_callback_url as string,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error('No email found from Google profile'));
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
              data: {
                name: profile.displayName,
                email,
                role: 'CANDIDATE',
                isVerified: true, // Google account already verified
                profilePhoto: profile.photos?.[0]?.value,
              },
            });

            await tx.candidateProfile.create({
              data: { userId: newUser.id },
            });

            return newUser;
          });
        } else if (user.role !== 'CANDIDATE') {
          return done(new Error('This email is registered as an Employer or Admin. Google login is only available for candidates.'));
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

export default passport;