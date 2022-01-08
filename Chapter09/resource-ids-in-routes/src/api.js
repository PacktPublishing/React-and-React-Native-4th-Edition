const users = [
  { first: "First 1", last: "Last 1", age: 1 },
  { first: "First 2", last: "Last 2", age: 2 }
];

export function fetchUsers() {
  return new Promise((resolve, reject) => {
    resolve(users);
  });
}

export function fetchUser(id) {
  return new Promise((resolve, reject) => {
    const user = users[id];

    if (user === undefined) {
      reject(`User ${id} not found`);
    } else {
      resolve(user);
    }
  });
}
