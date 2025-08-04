import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, PanResponder, Animated, FlatList, Dimensions, Alert, Pressable, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 模拟 API 请求的记录类型
export type ApiRequestRecord = {
  time: string;
  url: string;
  name: string;
  response: string;
  timestamp: string;
  method: string;
  status: number;
};
// API 监控统计记录类型
export type ApiMonitorStats = {
  name: string;
  url: string;
  totalCount: number;
  lastUsedTime?: string;
  lastResponse?: string;
  lastStatus?: number;
};
// 外部API接口

const ICON_SIZE = 50;

import { convertAPI, accountAPI, metricsAPII, galleryAPI, meridianAPI, chartAPI, firmwareAPI, signAPI } from '../env/apiEndpoints';

export const FloatingDev = {
  api: {
    getMonitorApiList: async () => {
      try {
        const defaultApis = [
          ...Object.entries(convertAPI).map(([name, url]) => ({ name, url, totalCount: 0 })),
          ...Object.entries(accountAPI).map(([name, url]) => ({ name, url, totalCount: 0 })),
          ...Object.entries(metricsAPII).map(([name, url]) => ({ name, url, totalCount: 0 })),
          ...Object.entries(galleryAPI).map(([name, url]) => ({ name, url, totalCount: 0 })),
          ...Object.entries(meridianAPI).map(([name, url]) => ({ name, url, totalCount: 0 })),
          ...Object.entries(chartAPI).map(([name, url]) => ({ name, url, totalCount: 0 })),
          ...Object.entries(firmwareAPI).map(([name, url]) => ({ name, url, totalCount: 0 })),
          ...Object.entries(signAPI).map(([name, url]) => ({ name, url, totalCount: 0 })),
        ];

        const currentData = await AsyncStorage.getItem('apiMonitorStats');
        const storedApis = currentData ? JSON.parse(currentData) : [];

        // 合并默认和存储的 API，避免重复
        const mergedApisMap = new Map();
        defaultApis.forEach(api => mergedApisMap.set(api.url, api));
        storedApis.forEach(api => mergedApisMap.set(api.url, api));

        return Array.from(mergedApisMap.values());
      } catch (error) {
        console.error('Failed to get monitor API list:', error);
        return [];
      }
    },
    addRecord: async (record: ApiRequestRecord) => {
      try {
        const currentData = await AsyncStorage.getItem('apiData');
        const apiData = currentData ? JSON.parse(currentData) : [];
        apiData.push(record);
        await AsyncStorage.setItem('apiData', JSON.stringify(apiData));
      } catch (error) {
        console.error('Failed to save API record:', error);
      }
    },
    removeOneRecord: async (timestamp: string) => {
      try {
        const currentData = await AsyncStorage.getItem('apiData');
        const apiData = currentData ? JSON.parse(currentData) : [];
        const apiDataFilter = apiData.filter((item: ApiRequestRecord) => item.timestamp !== timestamp);
        await AsyncStorage.setItem('apiData', JSON.stringify(apiDataFilter));
      } catch (error) {
        console.error('Failed to remove API record:', error);
      }
    },
    removeRecord: async (name: string) => {
      try {
        const currentData = await AsyncStorage.getItem('apiData');
        const apiData = currentData ? JSON.parse(currentData) : [];
        apiData.filter((item: ApiRequestRecord) => item.name !== name);
        await AsyncStorage.setItem('apiData', JSON.stringify(apiData));
      } catch (error) {
        console.error('Failed to remove API record:', error);
      }
    }
  }
};

/**
 * @date 2025-06-22
 * @author will
 * @description API监控浮动窗口
 * @returns 
 */
export default React.memo(function FloatingWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState('');
  const screen = Dimensions.get('window');

  const [currentTab, setCurrentTab] = useState(0); // 0: Recent, 1: Stats, 2: Add API
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [recordList, setRecordList] = useState([]);
  const [apiMonitorStatsList, setApiMonitorStatsList] = useState([]);
  
  // 使用Animated.Value管理位置，提高性能和稳定性
  const iconX = useRef(new Animated.Value(screen.width - ICON_SIZE - 20)).current;
  const iconY = useRef(new Animated.Value(screen.height - ICON_SIZE - 100)).current;
  
  // 记录拖动开始时的位置和偏移量
  const startX = useRef(0);
  const startY = useRef(0);
  const panOffsetX = useRef(0);
  const panOffsetY = useRef(0);
  
  // 记录上一次的最终位置，解决第二次拖动回归问题
  const lastPosition = useRef({ x: screen.width - ICON_SIZE - 20, y: screen.height - ICON_SIZE - 100 });
  
  const slideAnim = useRef(new Animated.Value(1000)).current;
  
  // 优化PanResponder配置
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (e, gestureState) => {
        // 记录拖动开始时的绝对位置和偏移量

        //@ts-ignore
        startX.current = iconX.__getValue();
        //@ts-ignore
        startY.current = iconY.__getValue();
        panOffsetX.current = gestureState.dx;
        panOffsetY.current = gestureState.dy;
        
        // 停止所有动画
        iconX.stopAnimation();
        iconY.stopAnimation();
      },
      
      onPanResponderMove: (e, gestureState) => {
        // 计算新位置
        const newX = startX.current + gestureState.dx - panOffsetX.current;
        const newY = startY.current + gestureState.dy - panOffsetY.current;
        
        // 边界限制
        const boundedX = Math.max(0, Math.min(newX, screen.width - ICON_SIZE));
        const boundedY = Math.max(0, Math.min(newY, screen.height - ICON_SIZE - 100));
        
        // Animated更新位置
        iconX.setValue(boundedX);
        iconY.setValue(boundedY);
      },
      
      onPanResponderRelease: (e, gestureState) => {
        // 计算最终位置并保存
        const newX = startX.current + gestureState.dx - panOffsetX.current;
        const newY = startY.current + gestureState.dy - panOffsetY.current;
        
        const boundedX = Math.max(0, Math.min(newX, screen.width - ICON_SIZE));
        const boundedY = Math.max(0, Math.min(newY, screen.height - ICON_SIZE - 100));
        
        // 保存最后位置
        lastPosition.current = { x: boundedX, y: boundedY };
        
        // 轻触时切换面板
        const distance = Math.sqrt(gestureState.dx ** 2 + gestureState.dy ** 2);
        if (distance < 5) {
          togglePanel();
        }
      },
      
      onPanResponderTerminate: (e, gestureState) => {
        // 触摸被中断时的处理
        const newX = startX.current + gestureState.dx - panOffsetX.current;
        const newY = startY.current + gestureState.dy - panOffsetY.current;
        
        const boundedX = Math.max(0, Math.min(newX, screen.width - ICON_SIZE));
        const boundedY = Math.max(0, Math.min(newY, screen.height - ICON_SIZE - 100));
        
        lastPosition.current = { x: boundedX, y: boundedY };
      }
    })
  ).current;

  const togglePanel = () => {
    setIsOpen((prev) => {
      const next = !prev;
      Animated.spring(slideAnim, {
        toValue: next ? 0 : 1000,
        useNativeDriver: true,
        bounciness: 3,
        speed: 5,
      }).start();
      return next;
    });
  };

  const addApiToMonitor = async () => {
    if (!name || !url) {
      Alert.alert('Input Error', 'Please provide valid API details.');
      setName('');
      setUrl('');
      return;
    }

    // 存储到本地监控列表&state
    const newMonitorStats = { name, url, totalCount: 0 };
    await AsyncStorage.setItem(
      'apiMonitorStats',
      JSON.stringify([...apiMonitorStatsList, newMonitorStats])
    );
    setApiMonitorStatsList([...apiMonitorStatsList, newMonitorStats]);
    setAddress(`${name} is now being monitored.`);
    console.log(`${name} is now being monitored.`);
  };

  // 读取存储的记录和监控数据
  const loadData = async () => {
    try {
      const recentData = await AsyncStorage.getItem('apiData');
      console.log("Recent Data:", recentData)
      const apiData = recentData ? JSON.parse(recentData).reverse().slice(0, 30) : [];
      setRecordList(apiData); 
      const statsData = await AsyncStorage.getItem('apiMonitorStats');
      const apiStats = statsData ? JSON.parse(statsData) : [];
      setApiMonitorStatsList(apiStats); 
      updateApiMonitorStats(apiStats, apiData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };
  
  const removeApiFromMonitor = async (name: string) => {
    const updatedStats = apiMonitorStatsList.filter((monitor) => monitor.name !== name);
    await AsyncStorage.setItem('apiMonitorStats', JSON.stringify(updatedStats));
    setApiMonitorStatsList(updatedStats);
    setAddress(`${name} has been removed from monitoring.`);
  };

  // 统计 API 请求次数、最后请求时间、最后响应数据
  const updateApiMonitorStats = (monitorStats: ApiMonitorStats[], records: ApiRequestRecord[]) => {
    const updatedStats = monitorStats.map((monitor) => {
      let totalCount = 0;
      let lastUsedTime = '';
      let lastResponse = '';
      records.forEach((record) => {
        if (record.url.includes(monitor.url)) {
          totalCount++;
          lastUsedTime = record.time;
          lastResponse = record.response;
          monitor.lastStatus = record.status;
        }
      });
      return {
        ...monitor,
        totalCount,
        lastUsedTime,
        lastResponse,
      };
    });
    // 更新 AsyncStorage 和 state
    AsyncStorage.setItem('apiMonitorStats', JSON.stringify(updatedStats));
    setApiMonitorStatsList(updatedStats);
  };

  const recordItem = ({item}: {item: ApiRequestRecord}) => {
    return (
      <View style={{ ...styles.recordItem, flexDirection: 'row', justifyContent: 'space-between', height: 300 }}>
        <View style={{ maxWidth: '90%' }} >
          <Text style={styles.recordItemTitle}>Time: {item.time}</Text>
          <Text style={{...styles.recordItemText,overflow:'hidden'}} numberOfLines={1} ellipsizeMode='tail'>URL: {item.url.replace('https://','')}</Text>
         
          <Text style={styles.recordItemText}>API Name: {item.name}</Text>
          <Text style={styles.recordItemText}>Method: {item.method}</Text>
          <Text style={styles.recordItemText}>Status: {item.status}</Text>
          <Text style={{ ...styles.recordItemText, maxHeight: 100, overflow: 'scroll', fontSize: 10, backgroundColor: '#fefefe', borderRadius: 5, padding: 5 }}>Response: {item.response}</Text>
          <Pressable style={{ backgroundColor: '#3498db', padding: 5, width: 100, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginVertical: 8 }} onPress={() => {
            setCurrentTab(2);
            setName(item.name);
            setUrl(item.url);
          }}>
            <Text style={{ color: 'white',fontSize: 10 }} numberOfLines={1}>+ Add Monitor</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => {
          FloatingDev.api.removeOneRecord(item.timestamp);
          setTimeout(() => {
            loadData();
          }, 100);
        }}>
          <Text style={{ color: 'red' }}>❌</Text>
        </Pressable>
      </View>
    )
  }

  useEffect(() => { if (isOpen) loadData(); }, [isOpen,currentTab]);

  return (
    <>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.floatingIcon,
          { left: iconX, top: iconY },
        ]}>
        <Text style={styles.iconText}>{isOpen ? 'X' : 'D'}</Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.panel,
          {transform: [{ translateY: slideAnim }]}
        ]}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, currentTab === 0 && styles.activeTab]}
            onPress={() => setCurrentTab(0)}>
            <Text style={styles.tabButtonText}>Recent API</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, currentTab === 1 && styles.activeTab]}
            onPress={() => setCurrentTab(1)} >
            <Text style={styles.tabButtonText}>API Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, currentTab === 2 && styles.activeTab]}
            onPress={() => setCurrentTab(2)} >
            <Text style={styles.tabButtonText}>Add API</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton]}
            onPress={() => loadData()}>
            <Text style={styles.tabButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
        {currentTab === 0 && (
          <FlatList
            getItemLayout={(_, index) => ({
              length: 300,  
              offset: 300 * index,
              index,
            })}
            ListHeaderComponent={<Text style={{ paddingBottom: 10 }}>Calls Count: {recordList.length}, Time: {new Date().toLocaleString()}</Text>}
            initialNumToRender={30} 
            maxToRenderPerBatch={30} 
            keyExtractor={(item) => item.timestamp}
            extraData={recordList}
            ListFooterComponent={<Text style={{ textAlign: 'center', marginVertical: 10 }}>Max 30 records</Text>}
            style={{ maxHeight: 300 }}
            data={recordList}
            renderItem={recordItem}/>
        )}
        {currentTab === 1 && (
          <View style={styles.tableContainer}>
            {apiMonitorStatsList.map((item:any, index:any) => (
              <View key={index} style={{ backgroundColor: '#fefefe', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                <View style={{ maxWidth: '90%' }} >
                  <Text style={styles.tableHeaderText}>API:{item.name}</Text>
                  <Text style={styles.tableHeaderText} numberOfLines={1}>URL:{item.url}</Text>
                  <Text style={{ ...styles.tableHeaderText }}>Call Count:{item.totalCount}</Text>
                  <Text style={{}}>Last Request:{item.lastUsedTime}</Text>
                  <Text >Last Status:{item.lastStatus}</Text>
                </View>
                <Pressable onPress={() => {
                  removeApiFromMonitor(item.name)
                }}>
                  <Text style={{ color: 'red', fontSize: 15 }}>❌</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
        {currentTab === 2 && (
          <View style={styles.addApiContainer}>
            <TextInput
              style={styles.input}
              placeholder="API Name"
              value={name}
              onChangeText={setName}/>
            <TextInput
              style={styles.input}
              placeholder="API URL(短链正则)"
              value={url}
              onChangeText={setUrl}/>
               {/* 正则匹配：API完整链接自动 包含 此处的短链接 */}
            <TouchableOpacity style={styles.button} onPress={addApiToMonitor}>
              <Text style={styles.buttonText}>Add API to Monitor</Text>
            </TouchableOpacity>
            <Text style={styles.address}>{address}</Text>
          </View>
        )}
      </Animated.View>
    </>
  );
});

const styles = StyleSheet.create({
  address: {
    color: '#3498db',
    fontSize: 16,
    marginTop: 10,
  },
  floatingIcon: {
    backgroundColor: '#3498db',
    borderRadius: 120,
    position: 'absolute',
    height: ICON_SIZE,
    width: ICON_SIZE,
    lineHeight: ICON_SIZE,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
    zIndex: 1000,
  },
  iconText: {
    color: '#fff',
    fontSize: 20,
  },
  panel: {
    position: 'absolute',
    width: Dimensions.get('screen').width - 40,
    bottom: 400,
    left: 20,
    right: 20,
    minHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 999,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recordItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f4f4f4',
    borderRadius: 10
  },
  recordItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recordItemText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  tableContainer: {
    marginTop: 10,
    maxHeight: 300,
    overflow: 'scroll',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
  },
  addApiContainer: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
