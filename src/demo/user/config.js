const userService = require("./userService");

const userRoutsConfig = () => {
    return {
        getAllUsers: {
            callback: userService.getAllUsers,
            methods: ["GET"],
            path: "/user/",
        },
        getUserById: {
            callback: userService.getUserById,
            methods: ["GET"],
            path: "/user/:id",
        },
        insertUser : {
            callback: userService.insertUser,
            methods: ["GET"],
            path: "/insertUser/:userName/:teamId",
        },
        updateUser : {
            callback: userService.updateUser,
            methods: ["GET"],
            path: "/updateUser/:id/:userName",
        },
        deleteUser : {
            callback : userService.deleteUser,
            methods : ["GET"],
            path : "/deleteUser/:id"
        }
    };
};

module.exports = userRoutsConfig;
