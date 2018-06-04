const teamService = require('../services/teamService');

const teamRoutsConfig = () => {
  return {
    getTeams: {
      callback: teamService.getAllTeams,
      methods: ['GET'],
      path: '/team/',
    },
    getTeamById: {
      callback: teamService.getTeamById,
      methods: ['GET'],
      path: '/team/:id',
    },
    insertTeam: {
      callback: teamService.insertTeam,
      methods: ['POST'],
      path: '/team',
    },
    updateTeam: {
      callback: teamService.updateTeam,
      methods: ['PUT'],
      path: '/team',
    },
    deleteTeam: {
      callback: teamService.deleteTeam,
      methods: ['DELETE'],
      path: '/team/:id',
    },
  };
};

module.exports = teamRoutsConfig;
