const func = () => {
    console.log('hello world');
};

const first = () => {
    console.log('first middleware');
};

const second = () => {
    console.log('second middleware');
};

const alterFirst = () => {
    console.log('alter first middleware');
};

const alterSecond = () => {
    console.log('alter second middleware');
};

export default {
    firstRoute: {
        callback: func,
        methods: ["GET"],
        middleware: [first, second],
        path: "/index",
    },
    secondRoute: {
        callback: func,
        methods: ["GET"],
        middleware: [alterFirst, alterSecond],
        path: "/home",
    },
};