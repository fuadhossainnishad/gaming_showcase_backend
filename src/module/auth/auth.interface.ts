export interface IForgotPassword {
  userId: string;
  email: string;
  otp: string;
  expiresAt: Date;
}
