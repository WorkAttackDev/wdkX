export type ApiResponse<Data> =
  | {
      data: Data;
      errors?: null;
      status?: number;
    }
  | {
      data: null;
      errors: string[];
      status?: number;
    };

export const isApiResponse = <Data>(data: any): data is ApiResponse<Data> => {
  return "data" in data && "errors" in data;
};
