import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const fakeNetworkData = {
  first: false,
  second: false,
  third: false,
};

let connected = false;
const unsynced = [];

export function set(key, value) {
  return new Promise((resolve, reject) => {
    if (connected) {
      fakeNetworkData[key] = value;
      resolve(true);
    } else {
      AsyncStorage.setItem(key, value.toString()).then(
        () => {
          unsynced.push(key);
          resolve(false);
        },
        (err) => reject(err)
      );
    }
  });
}

export function get(key) {
  return new Promise((resolve, reject) => {
    if (connected) {
      resolve(key ? fakeNetworkData[key] : fakeNetworkData);
    } else if (key) {
      AsyncStorage.getItem(key).then(
        (item) => resolve(item),
        (err) => reject(err)
      );
    } else {
      AsyncStorage.getAllKeys().then(
        (keys) =>
          AsyncStorage.multiGet(keys).then(
            (items) => resolve(Object.fromEntries(items)),
            (err) => reject(err)
          ),
        (err) => reject(err)
      );
    }
  });
}

NetInfo.fetch().then(
  (connection) => {
    connected = ["wifi", "unknown"].includes(connection.type);
  },
  () => {
    connected = false;
  }
);

NetInfo.addEventListener((connection) => {
  connected = ["wifi", "unknown"].includes(connection.type);

  if (connected && unsynced.length) {
    AsyncStorage.multiGet(unsynced).then((items) => {
      items.forEach(([key, val]) => set(key, val));
      unsynced.length = 0;
    });
  }
});
