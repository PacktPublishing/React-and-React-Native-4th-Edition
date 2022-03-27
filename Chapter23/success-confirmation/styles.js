import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "ghostwhite",
  },

  text: {
    color: "slategrey",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalInner: {
    backgroundColor: "azure",
    padding: 20,
    borderWidth: 1,
    borderColor: "lightsteelblue",
    borderRadius: 2,
    alignItems: "center",
  },

  modalText: {
    fontSize: 16,
    margin: 5,
    color: "slategrey",
  },

  modalButton: {
    fontWeight: "bold",
    margin: 5,
    color: "slategrey",
  },
});
