export interface IApiPayloadType {
  method: string,
  headers: {
    ['Content-Type']: string
  },
  body: URLSearchParams
}

export interface IApiResponseType {
  access_token: string,
  refresh_token: string,
  expires_in: number,
}
