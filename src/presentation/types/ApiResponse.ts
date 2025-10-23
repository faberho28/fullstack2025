export type ApiResponseType<T> = {
  success: boolean;
  responseCode: number;
  responseMessage: string;
  data: T;
};
