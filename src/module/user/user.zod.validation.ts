import { z } from 'zod';
import { USER_ROLE } from './user.constant';
import { linksRegex, passwordRegex } from '../../constants/regex.constants';

const userSignUpValidation = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name is required'),
    email: z.string({ required_error: 'Email is required' }).email(),
    role: z.enum([USER_ROLE.ADMIN, USER_ROLE.USER]).default(USER_ROLE.USER),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'minimum password length is 8')
      .regex(
        passwordRegex,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
  }),
});

const userSignInValidation = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'minimum password length is 8')
      .regex(
        passwordRegex,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
  }),
});

const userProfileUpdateValidation = z.object({
  body: z.object({
    _id: z.string({ required_error: 'Id is required' }),
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name is required')
      .optional(),
    userId: z.string({ required_error: 'UserId is required' }).optional(),
    role: z
      .enum([USER_ROLE.ADMIN, USER_ROLE.USER])
      .default(USER_ROLE.USER)
      .optional(),
    bio: z.string().optional(),
    links: z
      .array(
        z
          .string()
          .url('Each link must be valid url')
          .regex(linksRegex, 'Each link must match the allowed format'),
      )
      .optional()
      .default([])
      .refine(
        (links) => {
          return links.length <= 5;
        },
        {
          message: 'Maximum 5 links are allowed',
        },
      )
      .refine(
        (links) => {
          return new Set(links).size === links.length;
        },
        {
          message: 'Links must be unique',
        },
      ),
  }),
});

export const userValidation = {
  userSignUpValidation,
  userSignInValidation,
  userProfileUpdateValidation,
};
