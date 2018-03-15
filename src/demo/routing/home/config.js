const func = () => "Hello world";

const alterFunc = (testParam) => {
    return testParam;
};

const first = () => {
    // tslint:disable-next-line:no-console
    console.log("first middleware");
};

const second = () => {
    // tslint:disable-next-line:no-console
    console.log("second middleware");
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
