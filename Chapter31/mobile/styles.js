import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'ghostwhite',
  },

  textInput: {
    width: 300,
    alignSelf: 'center',
    height: 30,
    margin: 5,
  },

  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    margin: 5,
    alignItems: 'center',
  },
});