import { model, Schema } from 'mongoose';
import { IForgotPassword } from './auth.interface';

const forgotPasswordSchema = new Schema<IForgotPassword>(
  {
    userId: {
      type: String,
      required: [false, 'User ID is not required'],
    },
    email: {
      type: String,
      required: [true, 'Email is Not Required'],
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '0' },
    },
  },
  { timestamps: true },
);

const ForgotPassword = model<IForgotPassword>(
  'ForgotPassword',
  forgotPasswordSchema,
);
export default ForgotPassword;
