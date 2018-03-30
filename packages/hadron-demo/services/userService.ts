import { Team } from '../entity/Team';
import { User } from '../entity/User';
import { Repository } from 'typeorm';
import validate from '../entity/validation/validate';

class UserDto {
  constructor(public id: number, public name: string, public teamName: string) { }
}

const getAllUsers = async(userRepository: Repository<User>) =>
  await userRepository.find({relations : ['team']})
    .then(users => users.map(user => new UserDto(user.id, user.name, user.team.name)));

const getUserById = async(res: any, userRepository: Repository<User>, id: number) =>
  res.successGet(await userRepository.findOneById(id));

const insertUser = async(req: any, res: any, userRepository: Repository<User>,
  teamRepository: Repository<Team>) => {
  try {
    await validate('insertUser', req.body);
    return await teamRepository.findOneById(req.body.teamId)
      .then(team => userRepository.insert({ team, name: req.body.userName }))
      .then(() => userRepository.count())
      .then(amount => res.successUpdate(`Amount of users: ${amount}`));
  } catch (error) {
    res.entityValidationError(error);
  }
};

const updateUser = async(res: any, userRepository: Repository<User>,
  body: {id: number, userName: string, teamId: number }) => {
  try {
    await validate('updateUser', body);
    return await userRepository.findOneById(body.id)
          .then(user => {
            user.name = body.userName;
            return userRepository.save(user);
          })
          .then(() => res.successUpdate(`user id: ${body.id} has new name: ${body.userName}`));
  } catch (error) {
    res.entityValidationError(error);
  }
};

const deleteUser = async(res: any, userRepository: Repository<User>, id: number) => {
  res.successUpdate(await userRepository.removeById(id));
};

export { UserDto, getAllUsers, getUserById, insertUser, updateUser, deleteUser };
