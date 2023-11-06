import React from 'react';
import {Text, View, Image, Pressable} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

import styles from './styles';

const CoinListItem = ({coin}) => {
  const {
    id,
    image,
    name,
    market_cap_rank,
    symbol,
    price_change_percentage_24h,
    current_price,
    market_cap,
  } = coin;

  const percentageColor =
    price_change_percentage_24h < 0 ? '#ea3943' : '#16c784' || 'white';

  const navigation = useNavigation();

  new_market_cap = market_cap;

  if (market_cap > 1e12) {
    new_market_cap = `${(market_cap / 1e12).toFixed(3)} T`;
  } else if (market_cap > 1e9) {
    new_market_cap = `${(market_cap / 1e9).toFixed(3)} B`;
  } else if (market_cap > 1e6) {
    new_market_cap = `${(market_cap / 1e6).toFixed(3)} M`;
  } else if (market_cap > 1e3) {
    new_market_cap = `${(market_cap / 1e3).toFixed(3)} K`;
  }

  return (
    <Pressable
      style={styles.coinContainer}
      onPress={() => navigation.navigate('CoinDetailsScreen', {coinId: id})}>
      <Image
        source={{
          uri: image,
        }}
        style={{height: 30, width: 30, marginRight: 10, alignSelf: 'center'}}
      />
      <View>
        <Text style={styles.title}>{name}</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.rankContainer}>
            <Text style={styles.rank}>{market_cap_rank}</Text>
          </View>
          <Text style={styles.text}>{symbol.toUpperCase()}</Text>
          <AntDesign
            name={price_change_percentage_24h < 0 ? 'caretdown' : 'caretup'}
            size={12}
            color={percentageColor}
            style={{alignSelf: 'center', marginRight: 5}}
          />
          <Text style={{color: percentageColor}}>
            {price_change_percentage_24h?.toFixed(2)}%
          </Text>
        </View>
      </View>
      <View style={{marginLeft: 'auto'}}>
        <Text style={styles.title}>{current_price}</Text>
        <Text style={{color: 'white'}}>MCap {new_market_cap}</Text>
      </View>
    </Pressable>
  );
};

export default CoinListItem;
