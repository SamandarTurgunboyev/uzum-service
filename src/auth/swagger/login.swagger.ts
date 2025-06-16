import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

export function LoginSwagger() {
  return applyDecorators(
    ApiBody({
      schema: {
        example: {
          phone: 'string',
          password: 'string',
        },
      },
    }),
    ApiResponse({
      schema: {
        example: {
          accessToken: 'string',
          refreshToken: 'string',
        },
      },
    }),
  );
}
