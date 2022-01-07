const users = ["User 1", "User 2", "User 3"];

export function fetchUsers(desc) {
  return new Promise(resolve => {
    resolve(desc ? users.slice(0).reverse() : users);
  });
}
