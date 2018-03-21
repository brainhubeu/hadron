const func = () => "Hello world";

const alterFunc = (testParam) => {
    return testParam;
};

const first = (req, res, next) => {
// tslint:disable-next-line:no-console
console.log('first middleware');
next();
};

const second = (req, res, next) => {
// tslint:disable-next-line:no-console
console.log('second middleware');
next();
};

const homeConfig = () => {
    return {
        firstRoute: {
            callback: func,
            methods: ["GET"],
            middleware: [first, second],
            path: "/",
        },
        secondRoute: {
            callback: alterFunc,
            methods: ["get"],
            path: "/index/:testParam",
        },
    };
};

module.exports = homeConfig;
