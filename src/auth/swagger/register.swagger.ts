import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

export function RegisterSwagger() {
  return applyDecorators(
    ApiBody({
      schema: {
        example: {
          password: 'string',
          firstName: 'string',
          lastName: 'string',
          phone: 'string',
        },
      },
    }),
    ApiResponse({
      schema: {
        example: {
          message: 'string',
          phone: 'string',
        },
      },
    }),
  );
}

export function RegisterConfirmSwagger() {
  return applyDecorators(
    ApiBody({
      schema: {
        example: {
          phone: ' string',
          otp: ' string',
        },
      },
    }),
    ApiResponse({
      schema: {
        example: {
          access_token: 'string',
          refreshToken: 'string',
        },
      },
    }),
  );
}

export function RegisterResendSwagger() {
  return applyDecorators(
    ApiBody({
      schema: {
        example: {
          phone: 'string',
        },
      },
    }),
    ApiResponse({
      schema: {
        example: {
          message: 'string',
          phone: 'string',
        },
      },
    }),
  );
}
