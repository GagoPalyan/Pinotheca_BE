type TDataQuery = {
  page: number;
  limit: number;
  search?: string;
};

type TDataResponse<D> = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: D[];
};

export type { TDataQuery, TDataResponse };
