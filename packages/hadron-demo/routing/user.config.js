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
      path: '/insertUser/',
    },
    updateUser: {
      callback: userService.updateUser,
      methods: ['PUT'],
      path: '/updateUser/',
    },
    deleteUser: {
      callback: userService.deleteUser,
      methods: ['DELETE'],
      path: '/deleteUser/:id',
    },
  };
};

module.exports = userRoutsConfig;
