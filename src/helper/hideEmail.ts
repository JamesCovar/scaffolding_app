export const hideEmail = (email: string) => {
  const emailChunks = email.split("@");
  const emailInitials = emailChunks[0].slice(0, 3);

  return `${emailInitials}*****@${emailChunks[1]}`;
};
