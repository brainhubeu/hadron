import { User } from '../entity/User';
import validate from '../entity/validation/validate';
import { Container } from '@brainhubeu/hadron-core';
import { bcrypt } from '@brainhubeu/hadron-auth';
import { Role } from '../entity/Role';

class UserDto {
  constructor(
    public id: number,
    public username: string,
    public teamName: string,
    public roles: Role[],
  ) {}
}

const getAllUsers = async (req, { userRepository }) => {
  const users = await userRepository.find({ relations: ['team', 'roles'] });

  return {
    body: users.map(
      (user: User) =>
        new UserDto(user.id, user.username, user.team.name, user.roles),
    ),
  };
};

const getUserById = async ({ params }, { userRepository }) => {
  return {
    body: await userRepository.findOneById(params.id),
  };
};

const insertUser = async (
  req,
  { teamRepository, userRepository, roleRepository },
) => {
  try {
    await validate('insertUser', req.body);

    const existingUser = await userRepository.findOne({
      username: req.body.username,
    });

    if (existingUser) {
      throw new Error(`User: ${existingUser.username} already exists.`);
    }

    const team = await teamRepository.findOneById(req.body.teamId);
    const userRole = await roleRepository.findOne({ name: 'User' });
    const password = await bcrypt.hash(req.body.password);

    const user = new User();
    user.username = req.body.username;
    user.passwordHash = password;
    user.team = team;
    user.roles = [userRole];

    await userRepository.insert(user);

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
    user.username = body.username;

    await userRepository.save(user);

    return {
      body: { message: `user id: ${body.id} has new name: ${body.username}` },
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
