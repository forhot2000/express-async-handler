import { NextFunction, RequestHandler } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

export default function asyncHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>,
>(fn: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {
  return function asyncHandlerWrap(...args) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1] as NextFunction;
    return Promise.resolve(fnReturn).catch(next);
  };
}
