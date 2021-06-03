import asyncUtil from '../index';

const _ = null as any;

describe('asyncUtil', () => {
  it('should catch exceptions of a function passed into it', async () => {
    const error = new Error('catch me!');
    const foo = asyncUtil(() => {
      throw error;
    });
    expect(foo).toThrow(error);
  });

  it('should call next with the error when an async function passed into it throws', async () => {
    const error = new Error('catch me!');
    const next = jest.fn();
    const foo = asyncUtil(async (req, res, next) => {
      throw error;
    });

    await foo(_, _, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should call next with the arguments when an async function passed into it calls next', async () => {
    const next = jest.fn();
    const foo = asyncUtil(async (req, res, next) => {
      next('test');
    });

    await foo(_, _, next);
    expect(next).toHaveBeenCalledWith('test');
  });

  /*it('should provide additional arguments to the middleware', async () => {
    const next = jest.fn();
    const id = '1';

    const foo = asyncUtil(async (req, res, next, id) => {
      return id;
    });

    const result = await foo(null, null, next, id);
    expect(result).toEqual(id);
  });*/

  it('should accept a non-async function', async () => {
    const next = jest.fn();
    const foo = asyncUtil((req, res, next) => {
      next('test');
    });

    await foo(_, _, next);
    expect(next).toHaveBeenCalledWith('test');
  });

  it('should accept a non-async function erroring', async () => {
    const error = new Error('catch me!');
    const next = jest.fn();
    const foo = asyncUtil((req, res, next) => {
      next(error);
    });

    await foo(_, _, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  // NB, thenables are not guaranteed to have a `catch` method.
  it('should handle thenables', async () => {
    const error = Error('catch me!');
    // construct a minimalist thenable which we can fail at a specific time
    let thenable: any, triggerFailure: any;
    const registeringThenable = new Promise((resolve) => {
      thenable = {
        then: jest.fn((success, fail) => {
          triggerFailure = fail;
          resolve(null);
        }),
      };
    });

    // test the actual library feature
    const next = jest.fn();
    const catchingThenable = asyncUtil((_) => thenable)(_, _, next);
    await registeringThenable;
    expect(thenable?.then).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    triggerFailure(error);
    await catchingThenable;
    expect(next).toHaveBeenCalledWith(error);
  });
});
