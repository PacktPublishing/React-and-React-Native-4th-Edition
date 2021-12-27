import { Promise } from "bluebird";

Promise.config({ cancellation: true });

export function users(fail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(fail);
      } else {
        resolve({
          users: [
            { id: 0, name: "First" },
            { id: 1, name: "Second" },
            { id: 2, name: "Third" }
          ]
        });
      }
    }, 4000);
  });
}
