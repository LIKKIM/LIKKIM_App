// PriceChartCom.js
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Dimensions,
  Text,
  Pressable,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import * as Haptics from "expo-haptics";
import { DarkModeContext } from "./CryptoContext";
/**
 *
 * 2024/07/29
 * @author 2winter
 * @description 折线图组件,接收instId，上级ScrollViewRef,priceFla 货币符号
 * @param {object} param0
 * @returns
 */
export default function PriceChartCom({
  instId = "BTC-USD",
  parentScrollviewRef,
  priceFla = "$",
}) {
  const screenWidth = Dimensions.get("window").width;
  const load = useState(true);
  //選擇的數據點
  const _selectPointData = useState();
  //选择的索引
  const _selectIndex = useState(0);
  //圖表數據
  const _chartData = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  //图表原始数据
  const _sourceData = useState([]);
  //最低和最高收盘
  const maxAndMin = useState([]);
  //涨幅
  const priceIncrease = useState([0, 0]);
  //单位
  const priceFlag = priceFla;
  // 从上下文获取 isDarkMode 状态
  const { isDarkMode } = useContext(DarkModeContext);
  // 根据 isDarkMode 设置 textColor
  const textColor = isDarkMode ? "#fff" : "#000";
  const textTabColor = isDarkMode ? "#6E6E7F" : "#8C8C9C";
  const activeBackgroundColor = isDarkMode ? "#24234C" : "#fff";
  const inactiveBackgroundColor = "transparent";
  //取出最高，最低的開盤價格
  const _getMaxAndMinPrice = (data) => {
    const values = data.map((item) => parseFloat(item[4]));
    const max = Math.max(...values);
    const min = Math.min(...values);
    const maxIndex = values.indexOf(max);
    const minIndex = values.indexOf(min);
    maxAndMin[1]([max, min, maxIndex, minIndex]);
    // console.log('最大值&最小:', max, min);
  };

  //计算涨幅
  const calcPointPrice = (
    _index,
    is_default = true,
    _dataPoints = null,
    _dataSource = null
  ) => {
    let perStr = ""; //涨幅百分比
    let priceStr = ""; //涨幅价格
    if (is_default && _dataPoints) {
      //图表默认：收盘-开盘
      priceStr = parseFloat(_dataPoints.last[4] - _dataPoints.start[1]).toFixed(
        2
      );
      perStr = parseFloat((priceStr / _dataPoints.start[1]) * 100).toFixed(2);
    } else {
      //根据当前选择的数据：收盘-开盘

      if (!_sourceData[0][_index] && !_dataSource) return;
      const _parseData = _dataSource ?? _sourceData[0];
      priceStr = parseFloat(_parseData[_index][4] - _parseData[0][1]).toFixed(
        2
      );
      perStr = parseFloat((priceStr / _parseData[0][1]) * 100).toFixed(2);
    }
    //更新涨幅数据
    priceIncrease[1]([priceStr, perStr]);
  };

  //实现横向触摸刷新点,初始化
  const panResponder = useState(PanResponder.create());

  //刷新手势点,待优化
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
          const singlePointWidth = chartWidth / _sdata.length;
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

  //獲取API數據
  const _getData = async (_nd = "30m") => {
    // console.log('get Data');
    load[1](true);
    let _rd = await fetch(
      `https://df.likkim.com/api/market/index-candles?instId=${instId}&bar=${_nd}`
    )
      .then((res) => res.json())
      .catch((er) => {
        // console.error('獲取價格失敗：');
        // console.error(er instanceof Error ? er.message : er);
      });

    if (!_rd) return;
    const _cdata = _rd.data.map((r) => parseInt(r[4]));
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

  //切換數據
  const selectDate = useState(() => {
    _getData().catch((er) => null);
    // 确保 parentScrollviewRef.current 不为空且支持 setNativeProps
    if (
      parentScrollviewRef.current &&
      typeof parentScrollviewRef.current.setNativeProps === "function"
    ) {
      parentScrollviewRef.current.setNativeProps({ scrollEnabled: false });
    }
    return "30m";
  });

  //更新API查询范围
  const changeDate = (_nd) => {
    _selectIndex[1](0);
    _selectPointData[1](null);
    selectDate[1](_nd);
    _getData(_nd);
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <View style={{ marginLeft: 20 }}>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 30, color: textColor }}>
            {priceFlag}
            {_selectPointData[0]
              ? parseFloat(_selectPointData[0][4]).toFixed(2)
              : _chartData[0]
              ? parseFloat(_chartData[0][0]).toFixed(2)
              : ""}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
        >
          <Text
            style={{
              color: "#2A9737",
              fontWeight: "bold",
              color: priceIncrease[0][0] > 0 ? "#47B480" : "#D2464B",
            }}
          >
            {`${priceIncrease[0][0] > 0 ? "+" : ""}${priceIncrease[0][0]}`}(
            {priceIncrease[0][1] > 0 ? "+" : ""}
            {priceIncrease[0][1]}%)
          </Text>
          <Text style={{ marginLeft: 5, color: "gray" }}>
            {_selectPointData[0] &&
              new Date(parseFloat(_selectPointData[0][0])).toDateString() +
                "," +
                new Date(
                  parseFloat(_selectPointData[0][0])
                ).toLocaleTimeString()}
            {!_selectPointData[0] &&
              (selectDate[0] == "30m"
                ? "past 24 hours"
                : selectDate[0] == "1H"
                ? "past 7 days"
                : selectDate[0] == "1W"
                ? "past 1 year"
                : selectDate[0] == "1D"
                ? "past 30 days"
                : "")}
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
            return data == Math.floor(_selectPointData[0][4])
              ? "green"
              : "transparent";
          }}
          renderDotContent={({ x, y, indexData, index }) => {
            if (!_selectPointData[0]) return null;
            return indexData == Math.floor(_selectPointData[0][4]) ? (
              <View
                key={index}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(80,208,63,0.1)",
                  borderRadius: 50,
                  position: "absolute",
                  top: y - 20,
                  left: x - 20,
                }}
              ></View>
            ) : null;
          }}
          decorator={() => {
            if (!maxAndMin[0][0]) return null;
            const screenCenter = screenWidth / 2;
            const chartDataLength = _chartData[0].length;
            const minLeft =
              (screenWidth / chartDataLength) * maxAndMin[0][3] > screenCenter
                ? (screenWidth / chartDataLength) * maxAndMin[0][3] - 45
                : (screenWidth / chartDataLength) * maxAndMin[0][3] + 32;
            const maxLeft =
              (screenWidth / chartDataLength) * maxAndMin[0][2] > screenCenter
                ? (screenWidth / chartDataLength) * maxAndMin[0][2] - 45
                : (screenWidth / chartDataLength) * maxAndMin[0][2] + 32;
            // console.log('min:', (screenWidth / chartDataLength) * maxAndMin[0][3])
            // console.log('max', (screenWidth / chartDataLength) * maxAndMin[0][2])

            return (
              <>
                {/* 最大值 */}
                <View
                  key={"maxPoint"}
                  style={{ position: "absolute", top: -10, left: maxLeft }}
                >
                  <Text style={{ color: "#2A9737" }}>
                    {priceFlag}
                    {maxAndMin[0][0]}
                  </Text>
                </View>
                {/* 最低值 */}
                <View
                  key={"minPoint"}
                  style={{ position: "absolute", top: 188, left: minLeft }}
                >
                  <Text style={{ color: "#2A9737" }}>
                    {priceFlag}
                    {maxAndMin[0][1]}
                  </Text>
                </View>

                {load[0] && (
                  <View style={{ justifyContent: "center" }}>
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
            //触摸反馈
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
            fillShadowGradientOpacity: 0, // 透明度设为0
            useShadowColorFromDataset: false,
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            backgroundGradientTo: "#fff",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: () => `rgb(80,168.63)`,
          }}
          style={{ marginTop: 20, marginLeft: -32 }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: isDarkMode ? "#484692" : "#DEDEE1",
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
  );
}
