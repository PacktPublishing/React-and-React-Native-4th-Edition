import React, { useState, useEffect } from "react";
import { Text, View, Switch } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import styles from "./styles";
import { set, get } from "./store";

const boolMap = {
  true: true,
  false: false,
};

export default function App() {
  const [message, setMessage] = useState(null);
  const [first, setFirst] = useState(false);
  const [second, setSecond] = useState(false);
  const [third, setThird] = useState(false);
  const setters = new Map([
    ["first", setFirst],
    ["second", setSecond],
    ["third", setThird],
  ]);

  function save(key) {
    return (value) => {
      set(key, value).then(
        (connected) => {
          setters.get(key)(value);
          setMessage(connected ? null : "Saved Offline");
        },
        (err) => {
          setMessage(err);
        }
      );
    };
  }

  useEffect(() => {
    NetInfo.fetch().then(() =>
      get().then(
        (items) => {
          for (let [key, value] of Object.entries(items)) {
            setters.get(key)(value);
          }
        },
        (err) => {
          setMessage(err);
        }
      )
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <View>
        <Text>First</Text>
        <Switch
          value={boolMap[first.toString()]}
          onValueChange={save("first")}
        />
      </View>
      <View>
        <Text>Second</Text>
        <Switch
          value={boolMap[second.toString()]}
          onValueChange={save("second")}
        />
      </View>
      <View>
        <Text>Third</Text>
        <Switch
          value={boolMap[third.toString()]}
          onValueChange={save("third")}
        />
      </View>
    </View>
  );
}
