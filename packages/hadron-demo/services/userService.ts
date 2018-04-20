import { User } from '../entity/User';
import validate from '../entity/validation/validate';

class UserDto {
  constructor(
    public id: number,
    public name: string,
    public teamName: string,
  ) {}
}

const getAllUsers = async (req, { userRepository }) => {
  const users = await userRepository.find({ relations: ['team'] });

  return {
    body: users.map(
      (user: User) => new UserDto(user.id, user.name, user.team.name),
    ),
  };
};

const getUserById = async ({ params }, { userRepository }) => {
  return {
    body: await userRepository.findOneById(params.id),
  };
};

const insertUser = async (req, { teamRepository, userRepository }) => {
  try {
    await validate('insertUser', req.body);
    const team = await teamRepository.findOneById(req.body.teamId);

    await userRepository.insert({ team, name: req.body.userName });

    const amount = await userRepository.count();

    return {
      status: 201,
      body: { message: `Amount of users: ${amount}` },
    };
  } catch (error) {
    return {
      status: 400,
      body: { error: error.message },
    };
  }
};

const updateUser = async ({ body }, { userRepository }) => {
  try {
    await validate('updateUser', body);

    const user = await userRepository.findOneById(body.id);
    user.name = body.userName;

    await userRepository.save(user);

    return {
      body: { message: `user id: ${body.id} has new name: ${body.userName}` },
    };
  } catch (error) {
    return {
      status: 400,
      body: { error: error.message },
    };
  }
};

const deleteUser = async ({ params }, { userRepository }) => {
  return {
    body: await userRepository.removeById(params.id),
  };
};

export {
  UserDto,
  getAllUsers,
  getUserById,
  insertUser,
  updateUser,
  deleteUser,
};
