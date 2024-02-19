import { Prisma } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

export const throwPrismaErrors = (
  error: Prisma.PrismaClientKnownRequestError,
): HttpException => {
  switch (error.code) {
    case 'P2002':
      throw new HttpException('O registro já existe.', HttpStatus.CONFLICT);
    case 'P2025':
      throw new HttpException('Registro não encontrado.', HttpStatus.NOT_FOUND);
    case 'P2026':
      throw new HttpException(
        'Falha na restrição de chave estrangeira.',
        HttpStatus.BAD_REQUEST,
      );
    default:
      throw new HttpException(
        `Ocorreu um erro inesperado: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }
};
