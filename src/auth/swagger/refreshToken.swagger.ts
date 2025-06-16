import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

export function RefreshTokenSwagger() {
  return applyDecorators(
    ApiBody({
      schema: {
        example: {
          refreshToken: 'string',
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
