import { Team } from '../entity/Team';
import { User } from '../entity/User';
import { Repository } from 'typeorm';
import validate from '../entity/validation/validate';

class TeamDto {
  constructor(public id: number, public name: string, public amount: number) {}
}

const getAllTeams = async (teamRepository: Repository<Team>) =>
  await teamRepository
    .find({ relations: ['users'] })
    .then((teams) =>
      teams.map((team) => new TeamDto(team.id, team.name, team.users.length)),
    );

const getTeamById = async (teamRepository: Repository<Team>, id: number) =>
  await teamRepository.findOneById(id);

const updateTeam = async (
  res: any,
  teamRepository: Repository<Team>,
  body: { id: number; teamName: string },
) => {
  try {
    await validate('updateTeam', body);
    return await teamRepository
      .findOneById(body.id)
      .then((team: Team) => {
        team.name = body.teamName;
        return teamRepository.save(team);
      })
      .then(() =>
        res
          .status(201)
          .json(`team id: ${body.id} has new name ${body.teamName}`),
      );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const insertTeam = async (
  res: any,
  teamRepository: Repository<Team>,
  body: { teamName: string },
) => {
  try {
    await validate('insertTeam', body);
    return await teamRepository
      .insert({ name: body.teamName })
      .then(() => teamRepository.count())
      .then((amount) =>
        res.status(201).json(`total amount of teams: ${amount}`),
      );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTeam = async (
  res: any,
  teamRepository: Repository<Team>,
  userRepository: Repository<User>,
  id: number,
) => {
  await teamRepository
    .findOneById(id, { relations: ['users'] })
    .then((team) =>
      userRepository.removeByIds(team.users.map((user) => user.id)),
    )
    .then(() => res.status(201).json(teamRepository.removeById(id)));
};

export { getAllTeams, getTeamById, updateTeam, insertTeam, deleteTeam };
