import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "ghostwhite",
  },

  picker: {
    height: 200,
    width: 300,
    marginTop: 20,
  },

  icons: {
    alignSelf: "stretch",
  },

  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  itemIcon: {
    padding: 10,
    color: "slategrey",
  },

  itemText: {
    color: "slategrey",
  },
});
