import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ProfileSwagger() {
  return applyDecorators(
    ApiResponse({
      schema: {
        example: {
          data: {
            id: 'number',
            firstName: 'string',
            lastName: 'string',
            phone: 'string',
            images: 'string',
            isVerified: 'string',
            roles: 'string',
            created_at: 'string',
            update_at: 'string',
          },
        },
      },
    }),
  );
}
