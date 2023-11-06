import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {Ionicons, EvilIcons} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import {LineChart, CandlestickChart} from 'react-native-wagmi-charts';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MaterialIcons} from '@expo/vector-icons';
import {useRoute} from '@react-navigation/native';

import {
  getCoinData,
  getCoinMarketChart,
  getCandleChartData,
} from '../../services/requests';

import styles from './styles';
import CoinDetailsHeader from '../../components/CoinDetailsHeader/CoinDetailsHeader';
import FilterChart from '../../components/FilterChart/FilterChart';

const filterDaysArray = [
  {filterDay: '1', filterText: '24h'},
  {filterDay: '7', filterText: '7d'},
  {filterDay: '30', filterText: '30d'},
  {filterDay: '365', filterText: '1y'},
  {filterDay: 'max', filterText: 'All'},
];

const CoinDetailsScreen = () => {
  const route = useRoute();
  const {
    params: {coinId},
  } = route;

  const [loading, setLoading] = useState(false);
  const [coinValue, setCoinValue] = useState('1');
  const [sgdValue, setSgdValue] = useState('');
  const [selectedRange, setSelectedRange] = useState('1');
  const [coin, setCoin] = useState(null);
  const [coinMarketData, setCoinMarketData] = useState(null);
  const [coinCandleChartData, setCoinCandleChartData] = useState(null);
  const [isCandleChartVisible, setIsCandleChartVisible] = useState(false);

  const fetchCoinData = async () => {
    setLoading(true);
    const fetchedCoinData = await getCoinData(coinId);
    setCoin(fetchedCoinData);
    setSgdValue(fetchedCoinData.market_data.current_price.sgd.toString());
    setLoading(false);
  };

  const fetchMarketCoinData = async selectedRangeValue => {
    const fetchedCoinMarketData = await getCoinMarketChart(
      coinId,
      selectedRangeValue,
    );
    setCoinMarketData(fetchedCoinMarketData);
  };

  const fetchCandleStickChartData = async selectedRangeValue => {
    const fetchedSelectedCandleChartData = await getCandleChartData(
      coinId,
      selectedRangeValue,
    );
    setCoinCandleChartData(fetchedSelectedCandleChartData);
  };

  useEffect(() => {
    fetchCoinData();
    fetchMarketCoinData(1);
    fetchCandleStickChartData();
  }, []);

  const onSelectedRangeChange = selectedRangeValue => {
    setSelectedRange(selectedRangeValue);
    fetchMarketCoinData(selectedRangeValue);
    fetchCandleStickChartData(selectedRangeValue);
  };

  const memoOnSelectedRangeChange = React.useCallback(
    range => onSelectedRangeChange(range),
    [],
  );

  if (loading || !coin || !coinMarketData || !coinCandleChartData) {
    return <ActivityIndicator size="large" />;
  }

  const {
    id,
    image: {small},
    name,
    symbol,
    market_data: {market_cap_rank, current_price, price_change_percentage_24h},
  } = coin;

  const {prices} = coinMarketData;

  const percentageColor =
    price_change_percentage_24h < 0 ? '#ea3943' : '#16c784' || 'white';
  const screenWidth = Dimensions.get('window').width;
  const chartColor = current_price.sgd > prices[0][1] ? '#16c784' : '#ea3943';

  const formatCurrency = ({value}) => {
    'worklet';
    if (value === '') {
      if (current_price.sgd < 1) {
        return `$${current_price.sgd}`;
      }
      return `$${current_price.sgd.toFixed(2)}`;
    }
    if (current_price.sgd < 1) {
      return `$${parseFloat(value)}`;
    }
    return `$${parseFloat(value).toFixed(2)}`;
  };

  const changeCoinValue = value => {
    setCoinValue(value);
    const floatValue = parseFloat(value.replace(',', '.')) || 0;
    setSgdValue((floatValue * current_price.sgd).toString());
  };

  const changeSgdValue = value => {
    setSgdValue(value);
    const floatValue = parseFloat(value.replace(',', '.')) || 0;
    setCoinValue((floatValue / current_price.sgd).toString());
  };

  return (
    <GestureHandlerRootView>
      <View style={{paddingHorizontal: 10}}>
        <LineChart.Provider
          data={prices.map(([timestamp, value]) => ({timestamp, value}))}>
          <CoinDetailsHeader
            coinId={id}
            image={small}
            symbol={symbol}
            marketCapRank={market_cap_rank}
          />
          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.name}>{name}</Text>
              <LineChart.PriceText
                format={formatCurrency}
                style={styles.currentPrice}
              />
            </View>
            <View
              style={{
                backgroundColor: percentageColor,
                paddingHorizontal: 3,
                paddingVertical: 8,
                borderRadius: 5,
                flexDirection: 'row',
              }}>
              <AntDesign
                name={price_change_percentage_24h < 0 ? 'caretdown' : 'caretup'}
                size={12}
                color={'white'}
                style={{alignSelf: 'center', marginRight: 5}}
              />
              <Text style={styles.priceChange}>
                {price_change_percentage_24h?.toFixed(2)}%
              </Text>
            </View>
          </View>

          {
            // Filter dates component
          }
          <View style={styles.filtersContainer}>
            {filterDaysArray.map(day => (
              <FilterChart
                filterDay={day.filterDay}
                filterText={day.filterText}
                selectedRange={selectedRange}
                setSelectedRange={memoOnSelectedRangeChange}
                key={day.filterText}
              />
            ))}
            {isCandleChartVisible ? (
              <MaterialIcons
                name="show-chart"
                size={24}
                color="#16c784"
                onPress={() => setIsCandleChartVisible(false)}
              />
            ) : (
              <MaterialIcons
                name="waterfall-chart"
                size={24}
                color="#16c784"
                onPress={() => setIsCandleChartVisible(true)}
              />
            )}
          </View>

          {isCandleChartVisible ? (
            <CandlestickChart.Provider
              data={coinCandleChartData.map(
                ([timestamp, open, high, low, close]) => ({
                  timestamp,
                  open,
                  high,
                  low,
                  close,
                }),
              )}>
              <CandlestickChart height={screenWidth / 2} width={screenWidth}>
                <CandlestickChart.Candles />
                <CandlestickChart.Crosshair>
                  <CandlestickChart.Tooltip textStyle={{color: 'white'}} />
                </CandlestickChart.Crosshair>
              </CandlestickChart>
              <View style={styles.candleStickDataContainer}>
                <View>
                  <Text style={styles.candleStickTextLabel}>Open</Text>
                  <CandlestickChart.PriceText
                    style={styles.candleStickText}
                    type="open"
                  />
                </View>
                <View>
                  <Text style={styles.candleStickTextLabel}>High</Text>
                  <CandlestickChart.PriceText
                    style={styles.candleStickText}
                    type="high"
                  />
                </View>
                <View>
                  <Text style={styles.candleStickTextLabel}>Low</Text>
                  <CandlestickChart.PriceText
                    style={styles.candleStickText}
                    type="low"
                  />
                </View>
                <View>
                  <Text style={styles.candleStickTextLabel}>Close</Text>
                  <CandlestickChart.PriceText
                    style={styles.candleStickText}
                    type="close"
                  />
                </View>
              </View>
              <CandlestickChart.DatetimeText
                style={{color: 'white', fontWeight: '700', margin: 10}}
              />
            </CandlestickChart.Provider>
          ) : (
            <LineChart height={screenWidth / 2} width={screenWidth}>
              <LineChart.Path color={chartColor} />
              <LineChart.CursorCrosshair color={chartColor} />
            </LineChart>
          )}
          {
            // Coin price to SGD converter
          }
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row', flex: 1}}>
              <Text style={{color: 'white', alignSelf: 'center'}}>
                {symbol.toUpperCase()}
              </Text>
              <TextInput
                style={styles.input}
                value={coinValue}
                keyboardType="numeric"
                onChangeText={changeCoinValue}
              />
            </View>

            <View style={{flexDirection: 'row', flex: 1}}>
              <Text style={{color: 'white', alignSelf: 'center'}}>SGD</Text>
              <TextInput
                style={styles.input}
                value={sgdValue}
                keyboardType="numeric"
                onChangeText={changeSgdValue}
              />
            </View>
          </View>
        </LineChart.Provider>
      </View>
    </GestureHandlerRootView>
  );
};

export default CoinDetailsScreen;
