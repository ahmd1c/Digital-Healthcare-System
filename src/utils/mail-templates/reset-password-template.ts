export const resetPasswordTemplate = (token: string, userId: number) => {
  return `<p>Click on the link below to reset your password.</p> 
  <a href="${process.env.FRONTEND_URL}/reset-password/${token}/${userId}">Reset Password</a>`;
};
