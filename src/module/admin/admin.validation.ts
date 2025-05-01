import { z } from 'zod';

const approveGameValidation = z.object({
  body: z.object({
    gameId: z.string({ required_error: 'Game ID is required' }),
  }),
});

const approveGameUpdateValidation = z.object({
  body: z
    .object({
      updateId: z.string({ required_error: 'Update ID is required' }),
    })
    .strict({ message: 'Only updateId is allowed' }),
});

const rejectGameUpdateValidation = z.object({
  body: z
    .object({
      updateId: z.string({ required_error: 'Update ID is required' }),
    })
    .strict({ message: 'Only updateId is allowed' }),
});

const approveProfileUpdateValidation = z.object({
  body: z
    .object({
      updateId: z.string({ required_error: 'Update ID is required' }),
    })
    .strict({ message: 'Only updateId is allowed' }),
});

const rejectProfileUpdateValidation = z.object({
  body: z
    .object({
      updateId: z.string({ required_error: 'Update ID is required' }),
    })
    .strict({ message: 'Only updateId is allowed' }),
});

const AdminValidationSchema = {
  approveGameValidation,
  approveGameUpdateValidation,
  rejectGameUpdateValidation,
  approveProfileUpdateValidation,
  rejectProfileUpdateValidation,
};

export default AdminValidationSchema;
