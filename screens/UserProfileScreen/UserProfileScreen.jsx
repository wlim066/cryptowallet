import React from 'react';
import {View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';

import {auth} from '../../config/firebase';
import styles from './styles';

const UserProfileScreen = () => {
  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch(error => alert(error.message));
  };
  return (
    <ScrollView style={{flex: 1, paddingHorizontal: 20}}>
      <View style={styles.title}>
        <View>
          <Text style={{color: 'white'}}>{auth.currentUser?.email}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <MaterialIcons name="verified" size={20} color={'green'} />
          <Text style={{color: 'white'}}>Verified</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={console.log('Pressed!')}>
        <View>
          <Text style={{color: 'white', fontSize: 17}}>Currency</Text>
        </View>
        <View>
          <Text style={{color: 'white', fontSize: 17, fontWeight: 'bold'}}>
            SGD
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logout} onPress={handleSignOut}>
        <View>
          <Text style={{color: 'white', fontWeight: 'bold'}}>logout</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UserProfileScreen;
