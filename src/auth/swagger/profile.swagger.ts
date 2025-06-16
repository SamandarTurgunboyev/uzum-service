import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ProfileSwagger() {
  return applyDecorators(
    ApiResponse({
      schema: {
        example: {
          firstName: 'string',
          lastName: 'string',
          phone: 'string',
          images: 'string',
          isVerified: 'string',
          roles: 'string',
          _id: 'string',
        },
      },
    }),
  );
}
