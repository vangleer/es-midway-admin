export const DEFAULT_SUCCESS_CODE = 200
export const DEFAULT_ERROR_CODE = 900

export interface IResult<T = any> {
  data?: T
  code?: number
  message?: string
}

export const Result = {
  success<T>(option: IResult<T> = {}): IResult<T> {
    const {
      data = null,
      code = DEFAULT_SUCCESS_CODE,
      message = 'success'
    } = option
    return {
      code,
      data,
      message
    }
  },
  error(option: IResult = {}): IResult {
    const { data = null, code = DEFAULT_ERROR_CODE, message = 'error' } = option
    return {
      code,
      data,
      message
    }
  }
}
