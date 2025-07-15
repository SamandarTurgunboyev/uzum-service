export const lang_name = (lang: string, model: any) => {
  let name: string;
  let description: string;

  switch (lang) {
    case 'uz':
      name = model.name_uz;
      description = model.description_uz;
      break;
    case 'ru':
      name = model.name_ru;
      description = model.description_ru;
      break;
    case 'en':
      name = model.name_en;
      description = model.description_en;
      break;
    default:
      name = model.name_uz;
      description = model.description_uz;
  }
  return {
    name,
    description,
  };
};
