const inMemoryUsers: IUser[] = [];

export const addUser = (user: IUser) => {
  // const isExist = inMemoryUsers.forEach(userInArray => {
  //     if (user.username === userInArray.username) {
  //         return true;
  //     }
  //     return false;
  // });

  let isExist = false;

  for (const existsUser of inMemoryUsers) {
    if (user.username === existsUser.username) {
      isExist = true;
      break;
    }
  }

  if (!isExist) {
    inMemoryUsers.push(user);
  } else {
    console.log(`User: ${user.username} already exists in db`);
  }
};

export const displayUsers = () => {
  inMemoryUsers.forEach((user) => console.log(user));
};
