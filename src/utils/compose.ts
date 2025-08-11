export type Next<T> = (context: T) => T;

type Middleware<C> = (context: C, next: Next<C>) => C;

export const compose = <Ctx>(...middlewares: Middleware<Ctx>[]) => {
  return (context: Ctx) => {
    const loop = middlewares.slice(1).reduce((acc, nextMiddleware) => {
      return (ctx, next) => {
        return acc(ctx, (ctx) => nextMiddleware(ctx, next));
      };
    }, middlewares[0]);

    return loop(context, (ctx) => ctx);
  };
};

/*
const test = compose((ctx: Promise<number>, next) => {
  console.log('yay')
  next(ctx);
  return ctx;
}, (ctx, next) => {
  console.log('yay 2')
  next(ctx)
  return ctx;
}, (ctx, next) => {
  console.log('yay 3')
  next(ctx)
  return ctx;
})

test(Promise.resolve(2))*/
