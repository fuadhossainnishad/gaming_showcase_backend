import { z } from 'zod';

const approveGameValidation = z.object({
  body: z.object({
    id: z.string({ required_error: 'Game ID is required' }),
  }),
});

const AdminValidationSchema = {
  approveGameValidation,
};

export default AdminValidationSchema;