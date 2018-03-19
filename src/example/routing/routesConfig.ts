import * as multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const func = () => 'Hello world';

const alterFunc = (testParam: any) => testParam;

const uploadFile = (req: any) => req;

const uploadMiddleware = upload.any();

const first = (req: any, res: any, next: any) => {
  // tslint:disable-next-line:no-console
  console.log('first middleware');
  next();
};

const second = (req: any, res: any, next: any) => {
  // tslint:disable-next-line:no-console
  console.log('second middleware');
  next();
};

export default {
  firstRoute: {
    callback: func,
    methods: ['GET'],
    middleware: [first, second],
    path: '/',
  },
  routeForUploading: {
    callback: uploadFile,
    methods: ['post'],
    middleware: [uploadMiddleware],
    path: '/upload',
  },
  secondRoute: {
    callback: alterFunc,
    methods: ['get'],
    path: '/index/:testParam',
  },
};
