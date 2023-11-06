import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {doc, getDoc} from 'firebase/firestore';

import {getFavouritesCoins} from '../../services/requests';
import {auth, db} from '../../config/firebase';
import CoinListItem from '../../components/CoinListItem/CoinListItem';

const FavouritesScreen = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavouritesCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    // Get the current logged in user's favourited coin ids.
    const firebaseDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
    coinIds = firebaseDoc.get('favourites');

    if (coinIds === '') {
      setCoins([]);
      setLoading(false);
      return;
    }
    const favouriteCoinsData = await getFavouritesCoins(1, coinIds);
    setCoins(favouriteCoinsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchFavouritesCoins();
  }, []);

  return (
    <FlatList
      data={coins}
      renderItem={({item}) => <CoinListItem coin={item} />}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          tintColor="white"
          onRefresh={fetchFavouritesCoins}
        />
      }
    />
  );
};

export default FavouritesScreen;
