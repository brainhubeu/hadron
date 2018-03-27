const teamService = require("../services/teamService");

const teamRoutsConfig = () => {
    return {
        getTeams: {
            callback: teamService.getAllTeams,
            methods: ["GET"],
            path: "/team/",
        },
        getTeamById: {
            callback: teamService.getTeamById,
            methods: ["GET"],
            path: "/team/:id",
        },
        insertTeam : {
            callback: teamService.insertTeam,
            methods: ["POST"],
            path: "/insertTeam",
        },
        updateTeam : {
            callback: teamService.updateTeam,
            methods: ["PUT"],
            path: "/updateTeam",
        },
        deleteTeam : {
            callback : teamService.deleteTeam,
            methods : ["DELETE"],
            path: "/deleteTeam/:id",
        },
    };
};

module.exports = teamRoutsConfig;
