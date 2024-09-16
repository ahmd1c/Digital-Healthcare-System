export const otpTemplate = (otp: string) => {
  return `<h1>Your verification code is ${otp}</h1><p>This code will expire in 10 minutes</p>`;
};
