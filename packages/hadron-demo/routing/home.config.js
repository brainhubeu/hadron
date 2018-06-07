const helloWorldCallback = () => 'Hello world';
const versionCallback = () => `Version: ${process.env.VERSION || '0.0.1'}`;
const login = require('../security/loginRoute').default;

const homeConfig = () => {
  return {
    helloWorldRoute: {
      callback: helloWorldCallback,
      methods: ['GET'],
      path: '/',
    },
    versionRoute: {
      callback: versionCallback,
      methods: ['get'],
      path: '/version',
    },
    login: {
      callback: login,
      methods: ['POST'],
      path: '/login',
    },
  };
};

module.exports = homeConfig;
