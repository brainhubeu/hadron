import { addUser, displayUsers } from './userLoader';

displayUsers();
const user = {
  username: 'admin',
  password: 'admin',
  role: 'ADMIN',
};

const user2 = {
  username: 'admin',
  password: 'admin',
  role: 'ADMIN',
};

addUser(user);
addUser(user2);
console.log(user.username === user2.username);
displayUsers();
