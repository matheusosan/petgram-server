import * as bcrypt from 'bcrypt';

export const hash_password = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  return {
    hashPassword,
  };
};
