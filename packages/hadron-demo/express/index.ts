import { Container as container } from '../../hadron-core';

const getDate = () => {
  const d = new Date();
  return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};

export default {
  routes: {
    //
    // Basic Hello World
    //
    helloWorldRoute: {
      path: '/',
      callback: () => 'Hello world',
      methods: ['get'],
    },

    //
    // Route containing single middleware
    //
    singleMiddleware: {
      path: '/singleMiddleware',
      callback: (res: any) => res.successGet(`Hey! See console`),
      methods: ['get'],
      middleware: [
        (req: any, res: any, next: any) => {
          // tslint:disable:no-console
          console.log(`Hello, it's me, the very first middleware!`);
          next();
        },
      ],
    },

    //
    // Using multiple middlewares
    //
    multipleMiddlewares: {
      path: '/multipleMiddlewares',
      callback: (res: any) => res.successGet(`Hey! See console`),
      methods: ['get'],
      middleware: [
        (req: any, res: any, next: any) => {
          // tslint:disable:no-console
          console.log(
            `${getDate()}> First middleware, jump to next middleware in one second.`,
          );
          setTimeout(() => {
            next();
          }, 1000);
        },
        (req: any, res: any, next: any) => {
          // tslint:disable:no-console
          console.log(
            `${getDate()}> Finally second middleware. One second passed i think !`,
          );
          next();
        },
      ],
    },

    //
    // Load value registered in container
    //
    containerKey: {
      path: '/getContainerValue',
      methods: ['get'],
      callback: (customValue: any) => customValue,
    },

    //
    // Load custom value registered in container
    //
    customContainerKey: {
      path: '/getContainerValue/:key',
      methods: ['get'],
      callback: (res: any, key: string) => res.successGet(container.take(key)),
    },

    //
    // Display URL parameter
    //
    routeWithParam: {
      path: '/:param',
      methods: ['get'],
      callback: (param: any) => `First route param: ${param}`,
    },

    //
    // Display multiple URL parameters
    //
    routeWithMultipleParams: {
      path: '/:param/:param2',
      methods: ['get'],
      callback: (param: any, param2: any) =>
        `First param value: ${param}; Second param value: ${param2}`,
    },

    //
    // Register container value under specific key
    //
    registerCustomValue: {
      path: '/:key',
      methods: ['post'],
      callback: (res: any, key: string, body: { value: any }) => {
        container.register(key, body.value);
        res.status(200).json(`Value under key '${key}' is registered`);
      },
    },

    //
    // Clear value under specific key in container
    //
    deleteCustomValue: {
      path: '/:key',
      methods: ['delete'],
      callback: (res: any, key: string) => {
        container.register(key, null);
        res.status(200).json(`Value under key '${key}' has been deleted`);
      },
    },
  },
};
