export const pages = (params: { page: string; page_size: string }) => {
  const page = parseInt(params.page ?? '1', 10);
  const pageSize = parseInt(params.page_size ?? '8', 10);
  const offset = (page - 1) * pageSize;
  return {
    page,
    pageSize,
    offset,
  };
};
