export type TDataQuery = {
  page: number;
  limit: number;
  search?: string;
};

export type TDataResponse<D> = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: D[];
};
