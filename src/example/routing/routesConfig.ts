import * as multer from "multer";

const upload = multer({ dest: "uploads/" });

const func = (req: any, res: any, next: any) => res.json("Hello world");

const alterFunc = (req: any, res: any) => {
    return res.send(req.params.testParam);
};

const uploadFile = (req: any) => {
    return req.files;
};

const uploadMiddleware = upload.any();

const first = (req: any, res: any, next: any) => {
    // tslint:disable-next-line:no-console
    console.log("first middleware");
    next();
};

const second = (req: any, res: any, next: any) => {
    // tslint:disable-next-line:no-console
    console.log("second middleware");
    next();
};

export default {
    firstRoute: {
        callback: func,
        methods: ["GET"],
        middleware: [first, second],
        path: "/",
    },
    routeForUploading: {
        callback: uploadFile,
        methods: ["post"],
        middleware: [uploadMiddleware],
        path: "/upload",
    },
    secondRoute: {
        callback: alterFunc,
        methods: ["get"],
        path: "/index/:testParam",
    },
};
