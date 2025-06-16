import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

export function ForgetPassword() {
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
        },
      },
    }),
  );
}

export function ForgetPasswordConfirmSwagger() {
  return applyDecorators(
    ApiBody({
      schema: {
        example: {
          phone: 'string',
          otp: 'string',
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

export function ForgetNewPasswordConfirmSwagger() {
  return applyDecorators(
    ApiBody({
      schema: {
        example: {
          token: 'string',
          new_password: 'string',
          new_password_confirm: 'string',
        },
      },
    }),
    ApiResponse({
      schema: {
        example: {
          user: {
            firstName: 'string',
            lastName: 'string',
            phone: 'string',
            images: 'string',
            isVerified: 'string',
            roles: 'string',
          },
          accessToken: 'string',
          refreshToken: 'string',
        },
      },
    }),
  );
}
