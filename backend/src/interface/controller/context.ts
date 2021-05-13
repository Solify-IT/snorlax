import User from 'src/domain/model/user';
import { ILogger } from 'src/usecases/interfaces/logger';

export interface CookieOptions {
  maxAge?: number;
  signed?: boolean;
  expires?: Date;
  httpOnly?: boolean;
  path?: string;
  domain?: string;
  secure?: boolean;
}
interface ParsedQs { [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[] }
export interface IRequest {
  query: ParsedQs;
  params: {
    [param: string]: string,
    [captureGroup: number]: string
  };
  get(name: string): string | undefined;
  param(name: string, defaultValue?: any): string;
  is(type: string | string[]): string | false | null;
  body: any;
  currentUser: User;
}

export interface IResponse {
  locals: any;
  headersSent: boolean;
  status(code: number): this;
  sendStatus(code: number): this;
  links(links: any): this;
  send(body: string | Buffer | Object): this;
  json(obj: any): this;
  jsonp(obj: any): this;
  contentType(type: string): this;
  type(type: string): this;
  format(obj: any): this;
  attachment(filename?: string): this;
  set(fields: { [field: string]: string }): this;
  set(field: string, value: string): this;
  header(fields: { [field: string]: string }): this;
  header(field: string, value: string): this;
  get(field: string): string;
  clearCookie(name: string, options?: CookieOptions): this;
  cookie(name: string, val: string | Object, options?: CookieOptions): this;
  location(url: string): this;
  redirect(url: string): void;
  redirect(status: number, url: string): void;
  redirect(url: string, status: number): void;
  render(
    view: string,
    locals?:{ [local: string]: any },
    callback?: (err: Error | void, html?: string) => void,
  ): void;
  render(view: string, callback?: (err: Error, html: string) => void): void;
  vary(field: string): this;
}

export interface NextFunction {
  (err?: any): void;
  (deferToNext: 'router'): void;
}

export interface IContext {
  request: IRequest,
  response: IResponse,
  logger?: ILogger,
  next: NextFunction,
}
