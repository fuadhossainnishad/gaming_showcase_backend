import { z } from 'zod';

const approveGameValidation = z.object({
  body: z.object({
    id: z.string({ required_error: 'Game ID is required' }),
  }),
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
  approveProfileUpdateValidation,
  rejectProfileUpdateValidation,
};

export default AdminValidationSchema;
