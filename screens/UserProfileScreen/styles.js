import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  title: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  logout: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
    borderRadius: 20,
  },
});

export default styles;
