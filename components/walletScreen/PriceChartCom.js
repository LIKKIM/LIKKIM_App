// PriceChartCom.js
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Dimensions,
  Text,
  Pressable,
  PanResponder,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import * as Haptics from "expo-haptics";
import { DarkModeContext } from "../../utils/CryptoContext";
import { useTranslation } from "react-i18next";
import WalletScreenStyles from "../../styles/WalletScreenStyle";
import { chartAPI } from "../../env/apiEndpoints";

export default function PriceChartCom({
  instId = "BTC-USD",
  parentScrollviewRef,
  priceFla = "$",
}) {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const WalletScreenStyle = WalletScreenStyles(isDarkMode);
  const screenWidth = Dimensions.get("window").width;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const load = useState(true);
  const [hasData, setHasData] = useState(true);
  const _selectPointData = useState();
  const _selectIndex = useState(0);
  const _chartData = useState([0]);
  const _sourceData = useState([]);
  const maxAndMin = useState([]);
  const priceIncrease = useState([0, 0]);
  const priceFlag = priceFla;

  const textColor = isDarkMode ? "#fff" : "#000";
  const textTabColor = isDarkMode ? "#6E6E7F" : "#8C8C9C";
  const activeBackgroundColor = isDarkMode ? "#21201E" : "#fff";
  const inactiveBackgroundColor = "transparent";

  // Compute the maximum and minimum closing prices and their indices.
  const _getMaxAndMinPrice = (data) => {
    const values = data.map((item) => parseFloat(item[4]));
    const max = Math.max(...values);
    const min = Math.min(...values);
    const maxIndex = values.indexOf(max);
    const minIndex = values.indexOf(min);
    maxAndMin[1]([max, min, maxIndex, minIndex]);
  };

  // Calculate price change and percentage.
  const calcPointPrice = (
    _index,
    is_default = true,
    _dataPoints = null,
    _dataSource = null
  ) => {
    let perStr = "";
    let priceStr = "";
    if (is_default && _dataPoints) {
      priceStr = parseFloat(_dataPoints.last[4] - _dataPoints.start[1]).toFixed(
        2
      );
      perStr = parseFloat((priceStr / _dataPoints.start[1]) * 100).toFixed(2);
    } else {
      if (!_sourceData[0][_index] && !_dataSource) return;
      const _parseData = _dataSource ?? _sourceData[0];
      priceStr = parseFloat(_parseData[_index][4] - _parseData[0][1]).toFixed(
        2
      );
      perStr = parseFloat((priceStr / _parseData[0][1]) * 100).toFixed(2);
    }
    priceIncrease[1]([priceStr, perStr]);
  };

  // Initialize PanResponder for horizontal touch interactions.
  const panResponder = useState(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
    })
  );

  // Update PanResponder to track touch movements and update selected point.
  const updatePanResponder = (_sdata) => {
    panResponder[1](
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponderCapture: (e, gestureState) =>
          Math.abs(gestureState.dx > 5) || Math.abs(gestureState.dy > 5)
            ? true
            : false,
        onPanResponderMove: (evt, gestureState) => {
          const chartWidth = screenWidth;
          const numPoints = _sdata.length;
          const singlePointWidth = chartWidth / numPoints;
          const xPosition = gestureState.moveX;
          const index = Math.floor(xPosition / singlePointWidth);
          if (index >= 0 && index <= numPoints) {
            _selectPointData[1](_sdata[index]);
            _selectIndex[1](index);
            calcPointPrice(index, false, null, _sdata);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        },
      })
    );
  };

  // Fetch data from the API.
  const _getData = async (_nd = "30m") => {
    load[1](true);
    let _rd = await fetch(
      `${chartAPI.indexCandles}?instId=${instId}&bar=${_nd}`
    )
      .then((res) => res.json())
      .catch((er) => {
        // Handle error if needed.
      });

    if (!_rd || _rd.data.length === 0) {
      setHasData(false);
      load[1](false);
      return;
    }
    setHasData(true);
    const _cdata = _rd.data.map((r) => parseFloat(r[4]));
    _getMaxAndMinPrice(_rd.data);
    _chartData[1](_cdata);
    _sourceData[1](_rd.data);
    load[1](false);
    updatePanResponder(_rd.data);
    calcPointPrice(0, true, {
      start: _rd.data[0],
      last: _rd.data[_rd.data.length - 1],
    });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    _getData().then(() => setIsRefreshing(false));
  };

  // Initialize the date selection and fetch data.
  const selectDate = useState(() => {
    _getData().catch((er) => null);
    if (
      parentScrollviewRef.current &&
      typeof parentScrollviewRef.current.setNativeProps === "function"
    ) {
      parentScrollviewRef.current.setNativeProps({ scrollEnabled: false });
    }
    return "30m";
  });

  // Change the data interval and refresh data.
  const changeDate = (_nd) => {
    _selectIndex[1](0);
    _selectPointData[1](null);
    selectDate[1](_nd);
    _getData(_nd);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ marginVertical: 10 }}>
        <View style={{ height: 298 }}>
          {!hasData && !load[0] && (
            <View
              style={{
                height: 298,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                textAlign: "center",
              }}
            >
              <Text style={WalletScreenStyle.modalSubtitle}>
                {t("No data available")}
              </Text>
            </View>
          )}

          {hasData && (
            <>
              <View style={{ marginLeft: 20 }}>
                <View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 30,
                      color: textColor,
                    }}
                  >
                    {priceFlag}
                    {_selectPointData[0]
                      ? parseFloat(_selectPointData[0][4]).toFixed(2)
                      : _chartData[0]
                      ? parseFloat(_chartData[0][0]).toFixed(2)
                      : ""}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: priceIncrease[0][0] > 0 ? "#47B480" : "#D2464B",
                    }}
                  >
                    {`${priceIncrease[0][0] > 0 ? "+" : ""}${
                      priceIncrease[0][0]
                    }`}
                    ({priceIncrease[0][1] > 0 ? "+" : ""}
                    {priceIncrease[0][1]}%)
                  </Text>
                  <Text style={{ marginLeft: 5, color: "gray" }}>
                    {_selectPointData[0]
                      ? new Date(
                          parseFloat(_selectPointData[0][0])
                        ).toDateString() +
                        "," +
                        new Date(
                          parseFloat(_selectPointData[0][0])
                        ).toLocaleTimeString()
                      : selectDate[0] === "30m"
                      ? t("past 24 hours")
                      : selectDate[0] === "1H"
                      ? t("past 7 days")
                      : selectDate[0] === "1W"
                      ? t("past 1 year")
                      : selectDate[0] === "1D"
                      ? t("past 30 days")
                      : ""}
                  </Text>
                </View>
              </View>

              <View {...panResponder[0]?.panHandlers} pointerEvents="box-none">
                <LineChart
                  data={{ datasets: [{ data: _chartData[0] }] }}
                  width={Dimensions.get("window").width}
                  height={220}
                  getDotColor={(data, index) => {
                    if (!_selectPointData[0]) return "transparent";
                    return data === parseFloat(_selectPointData[0][4]) &&
                      index === _selectIndex[0]
                      ? "green"
                      : "transparent";
                  }}
                  renderDotContent={({ x, y, indexData, index }) => {
                    if (!_selectPointData[0]) return null;
                    return indexData === parseFloat(_selectPointData[0][4]) &&
                      index === _selectIndex[0] ? (
                      <View
                        key={index}
                        style={{
                          width: 80,
                          height: 80,
                          backgroundColor: "rgba(80,208,63,0.1)",
                          borderRadius: 50,
                          position: "absolute",
                          top: y - 40,
                          left: x - 40,
                        }}
                      />
                    ) : null;
                  }}
                  decorator={() => {
                    if (!maxAndMin[0][0]) return null;
                    const screenCenter = screenWidth / 2;
                    const chartDataLength = _chartData[0].length;
                    const minLeft =
                      (screenWidth / chartDataLength) * maxAndMin[0][3] >
                      screenCenter
                        ? (screenWidth / chartDataLength) * maxAndMin[0][3] - 45
                        : (screenWidth / chartDataLength) * maxAndMin[0][3] +
                          32;
                    const maxLeft =
                      (screenWidth / chartDataLength) * maxAndMin[0][2] >
                      screenCenter
                        ? (screenWidth / chartDataLength) * maxAndMin[0][2] - 45
                        : (screenWidth / chartDataLength) * maxAndMin[0][2] +
                          32;

                    return (
                      <>
                        <View
                          key={"maxPoint"}
                          style={{
                            position: "absolute",
                            top: -10,
                            left: maxLeft,
                          }}
                        >
                          <Text style={{ color: "#2A9737" }}>
                            {priceFlag}
                            {maxAndMin[0][0]}
                          </Text>
                        </View>
                        <View
                          key={"minPoint"}
                          style={{
                            position: "absolute",
                            top: 188,
                            left: minLeft,
                          }}
                        >
                          <Text style={{ color: "#2A9737" }}>
                            {priceFlag}
                            {maxAndMin[0][1]}
                          </Text>
                        </View>

                        {load[0] && (
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              width: 430,
                              height: 200,
                            }}
                          >
                            <ActivityIndicator
                              style={{ alignSelf: "center", margin: 10 }}
                            />
                          </View>
                        )}
                      </>
                    );
                  }}
                  withInnerLines={false}
                  bezier
                  withVerticalLabels={false}
                  withHorizontalLabels={false}
                  withOuterLines={false}
                  onDataPointClick={({ value, data, color, index }) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    _selectPointData[1](_sourceData[0][index]);
                    _selectIndex[1](index);
                    calcPointPrice(index);
                  }}
                  yAxisInterval={1}
                  chartConfig={{
                    fillShadowGradientFrom: "#fff",
                    fillShadowGradientToOpacity: 0,
                    backgroundGradientFrom: "#fff",
                    fillShadowGradientOpacity: 0,
                    useShadowColorFromDataset: false,
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientToOpacity: 0,
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 2,
                    color: () => `rgb(80,168.63)`,
                  }}
                  style={{ marginTop: 20, marginLeft: -32 }}
                />
              </View>
            </>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            backgroundColor: isDarkMode ? "#3F3D3C" : "#DEDEE1",
            padding: 2,
            borderRadius: 8,
            marginTop: "0%",
            width: "90%",
            marginHorizontal: "5%",
          }}
        >
          <View
            style={{
              backgroundColor:
                selectDate[0] === "30m"
                  ? activeBackgroundColor
                  : inactiveBackgroundColor,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
              flex: 1,
              marginRight: 5,
            }}
          >
            <Pressable onPress={() => changeDate("30m")}>
              <Text style={{ textAlign: "center", color: textColor }}>1D</Text>
            </Pressable>
          </View>
          <View
            style={{
              backgroundColor:
                selectDate[0] === "1H"
                  ? activeBackgroundColor
                  : inactiveBackgroundColor,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
              flex: 1,
              marginRight: 5,
            }}
          >
            <Pressable onPress={() => changeDate("1H")}>
              <Text style={{ textAlign: "center", color: textColor }}>1W</Text>
            </Pressable>
          </View>
          <View
            style={{
              backgroundColor:
                selectDate[0] === "1D"
                  ? activeBackgroundColor
                  : inactiveBackgroundColor,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
              flex: 1,
              marginRight: 5,
            }}
          >
            <Pressable onPress={() => changeDate("1D")}>
              <Text style={{ textAlign: "center", color: textColor }}>1M</Text>
            </Pressable>
          </View>
          <View
            style={{
              backgroundColor:
                selectDate[0] === "1W"
                  ? activeBackgroundColor
                  : inactiveBackgroundColor,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
              flex: 1,
            }}
          >
            <Pressable onPress={() => changeDate("1W")}>
              <Text style={{ textAlign: "center", color: textColor }}>1Y</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
