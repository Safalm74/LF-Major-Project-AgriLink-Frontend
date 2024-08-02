export interface IAxiosError {
  response?: {
    status: number;
    data: {
      message: string;
    };
  };
}
