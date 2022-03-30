import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "ghostwhite",
    paddingTop: 50,
  },

  input: {
    height: 35,
    backgroundColor: "white",
    marginBottom: 10,
    width: 100,
  },

  list: {
    height: 450,
  },

  controls: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    padding: 20,
  },

  button: {
    height: 45,
    width: 100,
    padding: 10,
    margin: 1,
    backgroundColor: "azure",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "slategrey",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "slategrey",
  },
});
