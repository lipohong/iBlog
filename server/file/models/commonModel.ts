import { Request, Response } from 'express';

export interface IRoute {
  routes(app: any): void;
}

export class StandardResponse {
  message?: string;
  payload?: object;
}

export interface IERequest extends Request {
  state: ReqStateModel;
  restriction: Object;
}

export class ReqStateModel {
  jwtPayload: IJWTPayloadModel;
}

export interface IEResponse extends Response {
  success: (message?: string, payload?: object) => void;
  throwErr: (err) => void;
  fail: (errStatus?: number, errMsg?: string) => void;
}

export interface IJWTSignModel {
  userId: string,
  username: string
}

export interface IJWTPayloadModel extends IJWTSignModel {
  iat: number;
  exp: number;
  iss: string;
}

export interface IPageModel {
  page: number;
  perPage: number;
}

export interface IPaginationModel {
  totalPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}

export interface IClientModel {
  clientId: string;
  clientSecret: string;
  clientName: string;
}
