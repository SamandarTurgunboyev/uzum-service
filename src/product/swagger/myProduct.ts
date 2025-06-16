import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

export function MyProductSwagger() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Sahifa raqami',
    }),
    ApiQuery({
      name: 'page_size',
      required: false,
      description: 'Har bir sahifadagi elementlar soni',
    }),
    ApiResponse({
      schema: {
        example: {
          data: {
            total_pages: 'number',
            page_size: 'number',
            page: 'number',
            next_page: 'boolean',
            prev_next: 'boolean',
            data: [
              {
                id: 'number',
                name: 'string',
                description: 'string',
                price: 'string',
                disCount: 'boolean',
                disPrice: 'string',
                category: {
                  id: 'string',
                },
                banner: ['string'],
                media: ['string'],
              },
            ],
          },
        },
      },
    }),
  );
}
