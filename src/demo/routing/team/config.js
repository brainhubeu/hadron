const teamService = require("../../services/teamService")

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
            methods: ["GET"],
            path: "/insertTeam/:teamName",
        },
        updateTeam : {
            callback: teamService.updateTeam,
            methods: ["GET"],
            path: "/updateTeam/:id/:teamName",
        },
        deleteTeam : {
            callback : teamService.deleteTeam,
            methods : ["GET"],
            path: "/deleteTeam/:id"
        }
    }
}

module.exports = teamRoutsConfig;
