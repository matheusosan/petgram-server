import * as jwt from 'jsonwebtoken';

export const decode_token = (token: string) => {
  if (!token) {
    throw new Error('Você deve estar logado');
  }

  const secret = process.env.JWT_SECRET;

  const payload = jwt.verify(token, secret);

  return {
    id: Number(payload.sub),
  };
};
