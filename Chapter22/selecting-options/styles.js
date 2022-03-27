import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "ghostwhite",
    justifyContent: "center",
  },

  pickersBlock: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  pickerHeight: {
    height: 250,
  },

  pickerContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    padding: 6,
    height: 240,
  },

  pickerLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },

  picker: {
    width: 150,
    backgroundColor: "white",
  },

  selection: {
    flex: 1,
    textAlign: "center",
  },
});
