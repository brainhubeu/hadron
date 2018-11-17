const testMiddleware = (req, res, next) => {
  res.locals.injected = 'I was injected here!';
  next();
};

const teamRoutsConfig = () => {
  return {
    nestedRoutes: {
      callback: () => ({ body: { response: 'Hello There!', locals } }),
      path: '/test/',
      middleware: [testMiddleware],
      routes: {
        route1: {
          callback: (req, container, locals) => ({
            body: { response: 'General Kenobi', locals },
          }),
          methods: ['GET'],
          path: '/route1/',
        },
        deepRoute1: {
          callback: (req, container, locals) => ({
            body: { response: 'You are a bold one!', locals },
          }),
          methods: ['POST'],
          $middleware: [],
          path: '/route2/',
        },
        route3: {
          callback: (req, container, locals) => ({
            body: { response: 'Kill him...', locals },
          }),
          methods: ['GET'],
          middleware: [
            (req, res, next) => {
              res.locals.additionalInjection = 'Some tasty addition';
              next();
            },
          ],
          $path: '/route3/',
          routes: {
            deepRoute1: {
              path: '/deepRoute/',
              callback: (req, container, locals) => ({
                body: { response: 'Kill him...', locals },
              }),
            },
          },
        },
      },
    },
  };
};

module.exports = teamRoutsConfig;
