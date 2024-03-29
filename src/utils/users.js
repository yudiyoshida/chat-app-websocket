const users = [];

const addUser = (object) => {
  let { id, username, room } = object;
  
  // Validators.
  if (!username || !room) 
    return { error: 'Username and room required!'};

  // Clean body - validators.
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Check if exists.
  const userExists = users.find((user) => {
    return (user.room === room && user.username === username);
  });

  // Validate username.
  if (userExists) {
    return { error: 'Username is in use!' };
  }

  // Store user.
  const user = { id, username, room };
  users.push(user);

  console.log(users);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return (user.id === id);
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };