import { NextFunction, RequestHandler } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

export default function asyncHandler<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = Query>(
  fn: RequestHandler<P, ResBody, ReqBody, ReqQuery>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return function asyncHandlerWrap(...args) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1] as NextFunction;
    return Promise.resolve(fnReturn).catch(next);
  };
}
