export type ApiResponse<Data> = {
  data: Data;
  errors?: string[] | null;
  status?: number;
};
