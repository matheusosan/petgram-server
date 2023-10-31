import * as jwt from 'jsonwebtoken';

export const decode_token = (token: string) => {
  const splitedToken = token.split(' ')[1];

  const secret = process.env.JWT_SECRET;

  const payload = jwt.verify(splitedToken, secret);

  return {
    id: Number(payload.sub),
  };
};
