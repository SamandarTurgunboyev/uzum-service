import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

export function UpdateProfileSwagger() {
  return applyDecorators(
    ApiBody({
      schema: {
        example: {
          firstName: 'string',
          lastName: 'string',
          images: 'File',
        },
      },
    }),
    ApiResponse({
      schema: {
        example: {
          firstName: 'string',
          lastName: 'string',
          phone: 'string',
          images: 'string',
          isVerified: 'string',
          roles: 'string',
        },
      },
    }),
  );
}

export function UpdatePasswordSwagger() {
  return applyDecorators(
    ApiBody({
      schema: {
        example: {
          old_password: 'string',
          new_password: 'string',
          password_confirm: 'string',
        },
      },
    }),
    ApiResponse({ schema: { example: { message: 'string' } } }),
  );
}
