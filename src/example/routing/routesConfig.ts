const func = () => 'Hello world';

const alterFunc = (params: any) => {
  return params.testParam;
};

const first = () => {
    // tslint:disable-next-line:no-console
  console.log('first middleware');
};

const second = () => {
    // tslint:disable-next-line:no-console
  console.log('second middleware');
};

export default {
  firstRoute: {
    callback: func,
    methods: ['GET'],
    middleware: [first, second],
    path: '/',
  },
  secondRoute: {
    callback: alterFunc,
    methods: ['get'],
    path: '/index/:testParam',
  },
};
