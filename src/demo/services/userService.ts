import { Team } from "entity/Team";
import { User } from "entity/User";
import { Repository } from "typeorm";

class UserDto {
    constructor(public id: number, public name: string, public teamName: string) { }
}

const getAllUsers = async (userRepository: Repository<User>) => {
    return await userRepository.find({relations : ["team"]})
    .then((users) => users.map((user) => new UserDto(user.id, user.name, user.team.name)));
};

const getUserById = async (userRepository: Repository<User>, id: number) => await userRepository.findOneById(id);

const insertUser = async (userRepository: Repository<User>,
                          teamRepository: Repository<Team>,
                          body: {userName: string, teamId: number }) => {
    return await teamRepository.findOneById(body.teamId)
                .then((t) => userRepository.insert({name: body.userName, team: t }))
                .then(() => userRepository.count())
                .then((amount) =>  `total amount of users: ${amount}`);
};

// const insertUser= async (userRepository: Repository<User>,
//                              teamRepository: Repository<Team>,body: {userName: string, teamId: number }) => {
//     console.log(body);
// };

const updateUser = async (userRepository: Repository<User>, body: {id: number, userName: string, teamId: number }) => {
    return await userRepository.findOneById(body.id)
          .then((user) => {
            user.name = body.userName;
            return userRepository.save(user);
          })
          .then(() => `user id: ${body.id} has new name ${body.userName}`);
};

const deleteUser = async (userRepository: Repository<User>, id: number) => {
    console.log(id);
    await userRepository.removeById(id);
};

export { UserDto, getAllUsers, getUserById, insertUser, updateUser, deleteUser };
