export interface IError {
  code: number;
  message: string;
  errors?: Array<IError>;
}
