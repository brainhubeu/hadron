const securedRoutesConfig = [
  {
    path: '/team/*',
    roles: [['Admin', 'User'], 'Manager'],
  },
  {
    path: '/user/*',
    methods: ['GET'],
    roles: ['NotExists', 'User', 'Admin'],
  },
  {
    path: '/user/*',
    methods: ['POST', 'PUT', 'DELETE'],
    roles: 'Admin',
  },
];

export default securedRoutesConfig;
