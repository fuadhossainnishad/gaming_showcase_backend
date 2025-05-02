import { z } from 'zod';
import { USER_ROLE } from './user.constant';
import {
  emailRegex,
  linksRegex,
  passwordRegex,
} from '../../constants/regex.constants';

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
    email: z
      .string({ required_error: 'Email is required' })
      .regex(emailRegex, 'Valid email is required'),
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
  body: z
    .object({
      name: z
        .string({ required_error: 'Name is required' })
        .min(1, 'Name is required')
        .optional(),
      bio: z.string().optional(),
      links: z
        .array(
          z
            .string()
            .url('Each link must be a valid URL')
            .regex(linksRegex, 'Each link must match the allowed format'),
        )
        .max(5, 'Maximum 5 links are allowed')
        .refine((links) => new Set(links).size === links.length, {
          message: 'Links must be unique',
        })
        .optional(),
      photo: z.string().optional(),
    })
    .strict({ message: 'Only name, bio, links, and photo are allowed' })
    .refine(
      (data) => Object.keys(data).length > 0,
      'At least one field must be provided for update',
    ),
});

const approveUpdateValidation = z.object({
  body: z
    .object({
      updateId: z.string({ required_error: 'Update ID is required' }),
    })
    .strict({ message: 'Only updateId is allowed' }),
});

const rejectUpdateValidation = z.object({
  body: z
    .object({
      updateId: z.string({ required_error: 'Update ID is required' }),
    })
    .strict({ message: 'Only updateId is allowed' }),
});

export const userValidation = {
  userSignUpValidation,
  userSignInValidation,
  userProfileUpdateValidation,
  approveUpdateValidation,
  rejectUpdateValidation,
};
