import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

export function CreateProductSwagger() {
  return applyDecorators(
    ApiBody({
      description:
        "Agarda disCount false bo'lsa ya'ni chegirma yo'q bolsa disPrice:chegirma narxi shart emas. Agarda disCount true bo'lsa ya'ni chegirma bor bolsa disPrice:chegirma narxi shart.",
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
          categoryId: 'string',
          brandId: 'string',
          disPrice: 'string',
          banner: ['string'],
          media: ['string'],
        },
      },
    }),
    ApiResponse({
      schema: {
        example: {
          id: 'number',
          name_uz: 'string',
          slug: 'string',
          name_ru: 'string',
          name_en: 'string',
          description_uz: 'string',
          description_ru: 'string',
          description_en: 'string',
          price: 'string',
          disCount: 'boolean',
          disPrice: 'string',
          banner: ['string'],
          media: ['string'],
          createdAt: 'string',
          updateAt: 'string',
        },
      },
    }),
  );
}
