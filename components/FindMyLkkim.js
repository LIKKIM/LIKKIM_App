

import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, View, Text, Pressable, ActivityIndicator } from "react-native";
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const styles = StyleSheet.create({
    container: {

        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%'

    },
});


/**
 * 寻找LKKIM定位
 * @author 2winter
 */
export default function FindMyLkkim() {


    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [status, requestPermission] = Location.useForegroundPermissions();
    //当前定位｜最近一次定位
    const [currentPosition, setPosition] = useState({
        lat: 0,//纬度
        lng: 0,//经度
        unix: 0,//时间戳
        status: false
    });

    //刷新时间误差
    const unixOffest = 1000 * 60 * 5;//五分钟之内为最新定位
    //是否最新定位
    const [positionUnix, setPositionUnix] = useState(0);
    //经纬度转地址
    const latlngToAddress = async ({ lat, lng }) => {
        let _address = await Location.reverseGeocodeAsync({
            latitude: lat, longitude: lng
        });

        // console.log('地址：')
        // console.log(_address);
        if (_address && _address.length > 0) {
            setAddress(_address[0].formattedAddress);
            syncLocalPosition({ lat, lng, unix: Date.now(), status: true, address: _address });//本地存储同步
        }

    }

    //获取当前定位
    const getCurrentPoistion = async () => {


        if (!(await Location.hasServicesEnabledAsync())) return alert('未开启手机定位功能！');

        console.log('检查定位权限');

        if (!status || !status.granted) {

            // console.log('未授予定位权限，开始请求定位');
            let _pr = await requestPermission();
            console.log(_pr);
            setLoading(false);
            if (!_pr.granted) return alert('申请被拒绝，请重新进入！');

        } else {
            console.log('定位权限授予.')
        }

        console.log('开始获取定位功能');

        setLoading(true);
        let lastPosition = await Location.getLastKnownPositionAsync();
        let _currentPosition = lastPosition;

        //未获取到上次缓存定位，开始获取最新定位
        if (!_currentPosition) {

            console.log('获取最新')
            _currentPosition = await Location.getCurrentPositionAsync();

        } else {
            console.log('获取上一次缓存')
        }

        console.log('获取成功:')
        console.log(_currentPosition)

        if (_currentPosition) {

            console.log('更新View定位')
            //定位成功同步到本地
            setPositionUnix(Date.now());//刷新最新定位时间
            setPosition({ lat: _currentPosition.coords.latitude, lng: _currentPosition.coords.longitude, unix: Date.now(), status: true })

            latlngToAddress({ lat: _currentPosition.coords.latitude, lng: _currentPosition.coords.longitude });
        } else {
            alert('定位失败.')
        }

        setLoading(false);


    }



    //保存定位到本地
    const syncLocalPosition = async (_info) => {

        AsyncStorage.setItem('positionInfo', JSON.stringify(_info))

    }

    //从本地恢复定位
    const restorePosition = async () => {



        let _positionInfo = await AsyncStorage.getItem('positionInfo');
        if (_positionInfo) {
            _positionInfo = JSON.parse(_positionInfo);
            console.log('缓存恢复数据：')
            console.log(_positionInfo);
            //TODO 恢复定位
            setPosition({ lat: _positionInfo.lat, lng: _positionInfo.lng, unix: _positionInfo.unix, status: true })
            //恢复地址
            setAddress(_positionInfo.address);
        } else {
            console.log('本地缓存不存在定位信息.')
        }


        //链接设备,同时重新刷新定位信息
        connectToLkkim();


    }



    //TODO 链接到设备
    const connectToLkkim = async () => {



        // console.log('链接设备...:' + Math.random());
        //链接成功 获取定位保存到本地,更新view定位。

        //TODO connect LKKIM
        if (true) {
            //链接设备成功 更新本地和state位置
            await getCurrentPoistion();


        }
        //else 链接失败，不刷新定位，默认只展示最近一次位置
    }



    useEffect(() => {

        restorePosition();//最近一次保存的定位信息

    }, [])

    return (

        <View style={{ flex: 1 }}>

            <View style={styles.container}>


                <MapView
                    provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined} // remove if not using Google Maps
                    style={styles.map}
                    zoomEnabled
                    zoomTapEnabled

                    zoomControlEnabled={true}

                    region={{
                        latitude: currentPosition.lat,
                        longitude: currentPosition.lng,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                >


                    <Marker coordinate={{ latitude: currentPosition.lat, longitude: currentPosition.lng }} onPress={() => alert('你的LIKKIM在这里！')}>
                        <View style={{ backgroundColor: "orange", padding: 10 }}>
                            <Text>LIKKIM - icon</Text>
                        </View>
                    </Marker>
                </MapView>
            </View>

            <View style={{ flex: 1, backgroundColor: '#f8f8f8', padding: 10, borderRadius: 20 }}>

                <View style={{ width: '10%', height: 5, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 10, marginLeft: '40%' }}></View>
                <View style={{ marginTop: 10, height: 50, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ fontWeight: 800, fontSize: 16, marginBottom: 5 }}>My Likkim Device.</Text>
                        {
                            !loading && <Text style={{ fontSize: 13 }}> {
                                Date.now() - positionUnix > unixOffest ? 'Last time：' + address : 'Now:' + address
                            }</Text>
                        }

                        {
                            loading && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{}}> Now:</Text><ActivityIndicator style={{ marginLeft: 5 }} />
                            </View>
                        }

                    </View>
                    {/* <Pressable onPress={getCurrentPoistion}><Text style={{ fontWeight: 800, color: 'blue' }}>Refresh</Text></Pressable> */}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <Pressable onPress={connectToLkkim} style={{ backgroundColor: 'rgba(0,0,0,0.05)', width: '38%', margin: '1%', padding: 30, borderRadius: 10 }}>
                        <Text>ICON</Text>
                        <Text>Connect</Text>
                    </Pressable>

                    <Pressable onPress={getCurrentPoistion} style={{ backgroundColor: 'rgba(0,0,0,0.05)', width: '58%', margin: '1%', padding: 30, borderRadius: 10 }}>
                        <Text>ICON</Text>

                        <Text>Refresh Position</Text>
                    </Pressable>
                </View>

                <Pressable style={{ width: '98%', margin: '1%', padding: 15, borderRadius: 30 }}>
                    <Text style={{ color: 'gray' }}>Last Day at xxxx</Text>
                    <Text style={{ color: 'gray' }}>Last Week at xxxx</Text>
                    <Text style={{ color: 'gray' }}>Last Month at xxxx</Text>
                </Pressable>


            </View>




        </View>
    )


}