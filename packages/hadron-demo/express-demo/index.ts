import { Container as container } from '@brainhubeu/hadron-core';

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
      callback: () => `Hey! See console`,
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
      callback: () => `Hey! See console`,
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
      callback: (req: any, { customValue }: any) => customValue,
    },

    //
    // Load custom value registered in container
    //
    customContainerKey: {
      path: '/getContainerValue/:key',
      methods: ['get'],
      callback: (req: any, { key }: { key: string }) => container.take(key),
    },

    //
    // Display URL parameter
    //
    routeWithParam: {
      path: '/:param',
      methods: ['get'],
      callback: ({ params }: any) => `First route param: ${params.param}`,
    },

    //
    // Display multiple URL parameters
    //
    routeWithMultipleParams: {
      path: '/:param/:param2',
      methods: ['get'],
      callback: ({ params }: any) =>
        `First param value: ${params.param}; Second param value: ${
          params.param2
        }`,
    },

    //
    // Register container value under specific key
    //
    registerCustomValue: {
      path: '/:key',
      methods: ['post'],
      callback: ({ params, body }: any) => {
        container.register(params.key, body.value);
        return `Value under key '${params.key}' is registered`;
      },
    },

    //
    // Clear value under specific key in container
    //
    deleteCustomValue: {
      path: '/:key',
      methods: ['delete'],
      callback: ({ params }: any) => {
        container.register(params.key, null);
        return `Value under key '${params.key}' has been deleted`;
      },
    },
  },
};
