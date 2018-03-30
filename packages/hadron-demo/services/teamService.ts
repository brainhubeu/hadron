import { Team } from '../entity/Team';
import { User } from '../entity/User';
import { Repository } from 'typeorm';
import validate from '../entity/validation/validate';

class TeamDto {
  constructor(public id: number, public name: string, public amount: number) { }
}

const getAllTeams = async(res: any, teamRepository: Repository<Team>) =>
  res.successGet(await teamRepository.find({relations : ['users']})
    .then(teams => teams.map(team => new TeamDto(team.id, team.name, team.users.length))));

const getTeamById = async(res: any, teamRepository: Repository<Team>, id: number) =>
  res.successGet(await teamRepository.findOneById(id));

const updateTeam = async(res: any, teamRepository: Repository<Team>, body: { id: number, teamName: string }) => {
  try {
    await validate('updateTeam', body);
    return await teamRepository.findOneById(body.id)
          .then(team => {
            team.name = body.teamName;
            return teamRepository.save(team);
          })
          .then(() => res.successUpdate(`team id: ${body.id} has new name ${body.teamName}`));
  } catch (error) {
    res.entityValidationError(error);
  }
};

const insertTeam = async(res: any, teamRepository: Repository<Team>, body: { teamName: string }) => {
  try {
    await validate('insertTeam', body);
    return await teamRepository.insert({name: body.teamName})
      .then(() => teamRepository.count())
      .then(amount => res.successUpdate(`total amount of teams: ${amount}`));
  } catch (error) {
    res.entityValidationError(error);
  }
};

const deleteTeam = async(res: any, teamRepository: Repository<Team>, userRepository: Repository<User>, id: number) => {
  await teamRepository.findOneById(id, { relations: ['users']})
    .then(team => userRepository.removeByIds(team.users.map(user => user.id)))
    .then(() => res.successUpdate(teamRepository.removeById(id)));
};

export { getAllTeams, getTeamById, updateTeam, insertTeam, deleteTeam };
