const userService = require('../services/userService');

const userRoutsConfig = () => {
  return {
    getAllUsers: {
      callback: userService.getAllUsers,
      methods: ['GET'],
      path: '/user/',
    },
    getUserById: {
      callback: userService.getUserById,
      methods: ['GET'],
      path: '/user/:id',
    },
    insertUser: {
      callback: userService.insertUser,
      methods: ['POST'],
      path: '/user/',
    },
    updateUser: {
      callback: userService.updateUser,
      methods: ['PUT'],
      path: '/user/',
    },
    deleteUser: {
      callback: userService.deleteUser,
      methods: ['DELETE'],
      path: '/user/:id',
    },
  };
};

module.exports = userRoutsConfig;
