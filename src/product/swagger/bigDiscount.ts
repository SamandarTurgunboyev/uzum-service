import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

export function BigDiscountSwagger() {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, description: 'Sahifa raqami' }),
    ApiQuery({
      name: 'page_size',
      required: false,
      description: 'Har bir sahifadagi element soni',
    }),
    ApiResponse({
      schema: {
        example: {
          data: {
            total_pages: 'number',
            page: 'number',
            page_size: 'number',
            next_page: 'boolean',
            prev_page: 'boolean',
            data: [
              {
                id: 'number',
                name: 'string',
                description: 'string',
                price: 'string',
                disCount: 'boolean',
                disPrice: 'sring',
                banner: ['sring'],
                media: ['sring'],
                createdAt: 'sring',
                updateAt: 'sring',
              },
            ],
          },
        },
      },
    }),
  );
}
