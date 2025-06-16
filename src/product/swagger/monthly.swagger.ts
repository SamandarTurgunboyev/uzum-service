import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

export function MonthlyProductSwagger() {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, description: 'Sahifa raqami' }),
    ApiQuery({
      name: 'page_size',
      required: false,
      description: 'Har bir sahifadagi elementlar soni',
    }),
    ApiResponse({
      schema: {
        example: {
          data: {
            total_page: 'number',
            page_size: 'number',
            page: 'number',
            next_page: 'boolean',
            prev_page: 'boolean',
            data: [
              {
                id: 'number',
                name: 'string',
                description: 'string',
                price: 'string',
                disCount: 'boolean',
                disPrice: 'string',
                banner: ['string'],
                media: ['string'],
                createdAt: 'string',
                updateAt: 'string',
              },
            ],
          },
        },
      },
    }),
  );
}
