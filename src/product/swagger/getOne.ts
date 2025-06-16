import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function GetOneProduct() {
  return applyDecorators(
    ApiResponse({
      schema: {
        example: {
          id: 'number',
          name: 'string',
          description: 'string',
          price: 'string',
          disCount: 'boolean',
          disPrice: 'string',
          banner: ['string'],
          media: ['string'],
          store: {
            id: 'number',
            store_name: 'string',
            addres: 'string',
            banner: 'string',
          },
        },
      },
    }),
  );
}
