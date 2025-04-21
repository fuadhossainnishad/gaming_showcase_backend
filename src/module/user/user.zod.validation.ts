import { z } from 'zod';

const userSignUpValidation = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name is required'),
    email: z.string({ required_error: 'Email is required' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'minimum password length is 8')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
  }),
});

const userSignInValidation = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .regex(/^[^\s@]+@[^\s@]+\.[\s@]$/, 'Invalid email'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'minimum password length is 8')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
  }),
});

export const userValidation = {
  userSignUpValidation,
  userSignInValidation,
};
