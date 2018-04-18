import { Team } from '../entity/Team';
import { User } from '../entity/User';
import { Repository } from 'typeorm';
import validate from '../entity/validation/validate';

class UserDto {
  constructor(
    public id: number,
    public name: string,
    public teamName: string,
  ) {}
}

const getAllUsers = async (userRepository: Repository<User>) =>
  await userRepository
    .find({ relations: ['team'] })
    .then((users: User[]) =>
      users.map(
        (user: User) => new UserDto(user.id, user.name, user.team.name),
      ),
    );

const getUserById = async (userRepository: Repository<User>, id: number) =>
  await userRepository.findOneById(id);

const insertUser = async (
  req: any,
  res: any,
  userRepository: Repository<User>,
  teamRepository: Repository<Team>,
) => {
  try {
    await validate('insertUser', req.body);
    return await teamRepository
      .findOneById(req.body.teamId)
      .then((team: Team) =>
        userRepository.insert({ team, name: req.body.userName }),
      )
      .then(() => userRepository.count())
      .then((amount: number) =>
        res.status(201).json({ message: `Amount of users: ${amount}` }),
      );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (
  res: any,
  userRepository: Repository<User>,
  body: { id: number; userName: string; teamId: number },
) => {
  try {
    await validate('updateUser', body);
    return await userRepository
      .findOneById(body.id)
      .then((user: User) => {
        user.name = body.userName;
        return userRepository.save(user);
      })
      .then(() =>
        res
          .status(201)
          .json(`user id: ${body.id} has new name: ${body.userName}`),
      );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (
  res: any,
  userRepository: Repository<User>,
  id: number,
) => {
  res.status(201).json(await userRepository.removeById(id));
};

export {
  UserDto,
  getAllUsers,
  getUserById,
  insertUser,
  updateUser,
  deleteUser,
};
