export type TAuth = {
  email: string;
  password: string;
};

export type TForgotPassword = {
  email: string;
};

export type TVerifyForgotPassword = {
  email: string;
  otp: string;
  newPassword: string;
};

export type TUpdateUserPassword = {
    userId: string;
    password: string;
    newPassword: string;
  };