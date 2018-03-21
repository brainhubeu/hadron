import { Team } from '../entity/Team';
import { User } from '../entity/User';
import { Repository } from 'typeorm';
// import validate from '../validation/validate';

class UserDto {
  constructor(public id: number, public name: string, public teamName: string) { }
}

const getAllUsers = async(userRepository: Repository<User>) =>
  await userRepository.find({relations : ['team']})
    .then(users => users.map(user => new UserDto(user.id, user.name, user.team.name)));

const getUserById = async(userRepository: Repository<User>, id: number) => await userRepository.findOneById(id);

const insertUser = async(userRepository: Repository<User>,
                          teamRepository: Repository<Team>,
                          body: {userName: string, teamId: number }) => {
  try {
    // await validate('insertUser', body);
    return await teamRepository.findOneById(body.teamId)
      .then(team => userRepository.insert({ team, name: body.userName }))
      .then(() => userRepository.count())
      .then(amount => `total amount of users: ${amount}`);
  } catch (error) {
    throw error;
  }
};

const updateUser = async(userRepository: Repository<User>, body: {id: number, userName: string, teamId: number }) => {
  try {
    // await validate('updateUser', body);
    return await userRepository.findOneById(body.id)
          .then(user => {
            user.name = body.userName;
            return userRepository.save(user);
          })
          .then(() => `user id: ${body.id} has new name ${body.userName}`);
  } catch (error) {
    throw error;
  }
};

const deleteUser = async(userRepository: Repository<User>, id: number) => {
  await userRepository.removeById(id);
};

export { UserDto, getAllUsers, getUserById, insertUser, updateUser, deleteUser };
