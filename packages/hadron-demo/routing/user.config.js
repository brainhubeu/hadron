// const userService = require("../../services/userService");

const foo = () => 'Not implemented yet...';

const userRoutsConfig = () => {
    return {
        getAllUsers: {
            callback: foo,
            methods: ["GET"],
            path: "/user/",
        },
        getUserById: {
            callback: foo,
            methods: ["GET"],
            path: "/user/:id",
        },
        insertUser : {
            callback: foo,
            methods: ["POST"],
            path: "/insertUser/",
        },
        updateUser : {
            callback: foo,
            methods: ["PUT"],
            path: "/updateUser/",
        },
        deleteUser : {
            callback : foo,
            methods : ["DELETE"],
            path : "/deleteUser/:id"
        }
    };
};

module.exports = userRoutsConfig;
