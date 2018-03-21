// const teamService = require("../../services/teamService")

const foo = () => 'Not implemented yet...';

const teamRoutsConfig = () => {
    return {
        getTeams: {
            callback: foo,
            methods: ["GET"],
            path: "/team/",
        },
        getTeamById: {
            callback: foo,
            methods: ["GET"],
            path: "/team/:id",
        },
    
        insertTeam : {
            callback: foo,
            methods: ["POST"],
            path: "/insertTeam",
        },
        updateTeam : {
            callback: foo,
            methods: ["PUT"],
            path: "/updateTeam",
        },
        deleteTeam : {
            callback : foo,
            methods : ["DELETE"],
            path: "/deleteTeam/:id"
        }
    }
}

module.exports = teamRoutsConfig;
