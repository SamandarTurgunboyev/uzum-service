import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export function updateProductSwagger() {
  return applyDecorators(
    ApiBody({
      schema: {
        example: {
          name_uz: 'string',
          name_ru: 'string',
          name_en: 'string',
          description_uz: 'string',
          description_en: 'string',
          description_ru: 'string',
          price: 'string',
          disCount: 'boolean',
          disPrice: 'string',
          banner: ['string'],
          media: ['string'],
        },
      },
    }),
  );
}
