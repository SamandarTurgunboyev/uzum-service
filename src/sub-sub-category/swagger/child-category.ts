import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

export function ChildCategorySwagger() {
  return applyDecorators(
    ApiBody({
      schema: {
        example: {
          name_uz: 'string',
          name_ru: 'string',
          name_en: 'string',
          id: 'sub-category id',
        },
      },
    }),
    ApiResponse({
      schema: {
        example: {
          id: 'number',
          name_uz: 'string',
          name_ru: 'string',
          name_en: 'string',
          subCategory: {
            id: 'number',
            name_uz: 'string',
            name_ru: 'string',
            name_en: 'string',
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
