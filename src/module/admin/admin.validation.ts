import { z } from 'zod';

const approveGameValidation = z.object({
  body: z.object({
    data: z.object({
      gameId: z.string({ required_error: 'Game ID is required' }),
    }),
  }),
});

const approveGameUpdateValidation = z.object({
  body: z.object({
    data: z.object({
      updateId: z.string({ required_error: 'Update ID is required' }),
    }),
  }),
  // .strict({ message: 'Only updateId is allowed' }),
});

const rejectGameUpdateValidation = z.object({
  body: z.object({
    data: z.object({
      updateId: z.string({ required_error: 'Update game ID is required' }),
    }),
  }),
  // .strict({ message: 'Only updateId is allowed' }),
});

const approveProfileUpdateValidation = z.object({
  body: z.object({
    data: z.object({
      updateId: z.string({ required_error: 'Update profile ID is required' }),
    }),
  }),
  // .strict({ message: 'Only updateId is allowed' }),
});

const rejectProfileUpdateValidation = z.object({
  body: z.object({
    data: z.object({
      updateId: z.string({ required_error: 'Update profile ID is required' }),
    }),
  }),
});

const deleteUserValidationSchema = z.object({
  body: z.object({
    data: z.object({
      userId: z.string({ required_error: 'User iD is required' }),
    }),
  }),
});

const deleteGameValidationSchema = z.object({
  body: z.object({
    data: z.object({
      gameId: z.string({ required_error: 'Game iD is required' }),
    }),
  }),
});

const AdminValidationSchema = {
  approveGameValidation,
  approveGameUpdateValidation,
  rejectGameUpdateValidation,
  approveProfileUpdateValidation,
  rejectProfileUpdateValidation,
  deleteUserValidationSchema,
  deleteGameValidationSchema,
};

export default AdminValidationSchema;
