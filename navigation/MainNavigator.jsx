import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen/LoginScreen';
import CoinDetailsScreen from '../screens/CoinDetailsScreen/CoinDetailsScreen';
import BottomTabNavigator from './BottomTabNavigator';
// import AddNewAssetScreen from '../screens/AddNewAssetScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CoinDetailsScreen"
        component={CoinDetailsScreen}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="AddNewAssetScreen"
        component={AddNewAssetScreen}
        options={{
          title: 'Add New Asset',
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      /> */}
    </Stack.Navigator>
  );
};

export default Navigation;
