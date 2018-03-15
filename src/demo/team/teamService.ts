import { Team } from "entity/Team";
import { User } from "entity/User";
import { Repository } from "typeorm";

class TeamDto {
    constructor(public id: number, public name: string, public amount: number) { }
}

const getAllTeams = async (teamRepository: Repository<Team>) => {
    return await teamRepository.find({relations : ["users"]})
    .then((teams) => teams.map((team) => new TeamDto(team.id, team.name, team.users.length)));
};

const getTeamById = async (teamRepository: Repository<Team>, id: number) => await teamRepository.findOneById(id);

const updateTeam = async (teamRepository: Repository<Team>, id: number, teamName: string) => {
    await teamRepository.findOneById(id)
          .then((team) => {
            team.name = teamName;
            return teamRepository.save(team);
          })
          .then(() => `team id: ${id} has new name ${teamName}`);
};

const insertTeam = async (teamRepository: Repository<Team>, teamName: string) => {
    await teamRepository.insert({name: teamName})
    .then(() => teamRepository.count())
    .then((amount) => `total amount of teams: ${amount}`);
};

const deleteTeam = async (teamRepository: Repository<Team>, userRepository: Repository<User>, id: number) => {
    await teamRepository.findOneById(id, { relations: ["users"]})
        .then((team) => userRepository.removeByIds(team.users.map((user) => user.id)))
        .then(() => teamRepository.removeById(id));
};

export { getAllTeams, getTeamById, updateTeam, insertTeam, deleteTeam };
