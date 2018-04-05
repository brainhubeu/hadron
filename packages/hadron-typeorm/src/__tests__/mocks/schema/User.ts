export default {
  name: 'User',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'string',
    },
    team: {
      type: 'string',
    },
  },
};
