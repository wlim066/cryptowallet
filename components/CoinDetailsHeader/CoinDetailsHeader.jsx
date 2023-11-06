import React, {useState, useEffect} from 'react';
import {View, Text, Image, ActivityIndicator} from 'react-native';
import {Ionicons, FontAwesome} from '@expo/vector-icons';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {auth, db} from '../../config/firebase';
import {doc} from 'firebase/firestore';
import {
  getUserCoinData,
  addUserCoinData,
  updateUserCoinData,
  deleteUserCoinData,
} from '../../services/firebase';

const CoinDetailsHeader = props => {
  const {coinId, image, symbol, marketCapRank} = props;
  const navigation = useNavigation();

  const favouriteDoc = doc(db, 'users', auth.currentUser.email);

  const [loading, setLoading] = useState(false);
  const [coinIds, setCoinIds] = useState('');
  const [favourite, setFavourite] = useState(false);

  const initCoinIds = async () => {
    setLoading(true);
    const userCoinData = await getUserCoinData(favouriteDoc);
    if (userCoinData == null) {
      setCoinIds('');
    } else {
      setCoinIds(userCoinData);
    }
    setLoading(false);
  };

  const checkIfCoinIsFavourited = () => {
    return coinIds.includes(coinId);
  };

  useEffect(() => {
    initCoinIds();
  }, []);

  useEffect(() => {
    if (checkIfCoinIsFavourited()) {
      setFavourite(true);
    } else {
      setFavourite(false);
    }
  }, [coinIds]);

  const handleFavouriteCoin = () => {
    if (favourite) {
      const coinToRemove = coinId + '%2C';
      console.log('coinID ' + coinToRemove);
      console.log('before update ' + coinIds);
      const newCoinIds = coinIds.replace(coinToRemove, '');
      console.log('after update ' + newCoinIds);
      updateUserCoinData(favouriteDoc, newCoinIds);
      // Once finish updating, set the coinIds variable to trigger the render again
      setCoinIds(newCoinIds);
    } else {
      deleteUserCoinData(favouriteDoc);
      const coinToAdd = coinId + '%2C';
      console.log('before add' + coinIds);
      const newCoinIds = coinIds.concat(coinToAdd);
      console.log('after add' + newCoinIds);
      addUserCoinData(favouriteDoc, newCoinIds);
      // Once finish updating, set the coinIds variable to trigger the render again
      setCoinIds(newCoinIds);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.headerContainer}>
      <Ionicons
        name="chevron-back-sharp"
        size={30}
        color="white"
        onPress={() => navigation.goBack()}
      />
      <View style={styles.tickerContainer}>
        <Image source={{uri: image}} style={{width: 25, height: 25}} />
        <Text style={styles.tickerTitle}>{symbol.toUpperCase()}</Text>
        <View style={styles.rankContainer}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>
            #{marketCapRank}
          </Text>
        </View>
      </View>
      <FontAwesome
        name={favourite ? 'star' : 'star-o'}
        size={25}
        color={favourite ? '#FFBF00' : 'white'}
        onPress={handleFavouriteCoin}
      />
    </View>
  );
};

export default CoinDetailsHeader;
