import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

export function ChildCategorySwagger() {
  return applyDecorators(
    ApiBody({
      schema: {
        example: {
          name: 'string',
        },
      },
    }),
    ApiResponse({
      schema: {
        example: {
          id: 'number',
          name: 'string',
          subCategory: {
            id: 'number',
            name: 'string',
            slug: 'string',
            createdAt: 'string',
            updateAt: 'string',
          },
          slug: 'string',
          createdAt: 'string',
          updateAt: 'string',
        },
      },
    }),
  );
}
