

import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, View, Text, Pressable, ActivityIndicator } from "react-native";


import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const styles = StyleSheet.create({
    container: {

        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        flex: 1
    },
});


/**
 * 寻找LKKIM定位
 * @author 2winter
 */
export default function FindMyLkkim() {


    const [loading, setLoading] = useState(false);

    //当前定位｜最近一次定位
    const [currentPosition, setPosition] = useState({
        lat: 0,//纬度
        lng: 0,//经度
        unix: 0//时间戳
    });

    //刷新时间误差
    const unixOffest = 1000 * 60 * 5;//五分钟之内为最新定位

    //是否最新定位
    const [positionUnix, setPOsitionUnix] = useState(0);


    //获取当前定位
    const getCurrentPoistion = async () => {



    }



    //保存定位到本地
    const syncLocalPosition = async ({ lat, lng }) => {


    }

    //从本地恢复定位
    const restorePosition = async () => {


    }



    //TODO 链接到设备
    const connectToLkkim = async () => {



        console.log('链接设备...:' + Math.random());

        setLoading(true)
        //链接成功 获取定位保存到本地,更新view定位。

        //TODO connect LKKIM
        if (Math.random() > 0.5) {
            //链接设备成功 更新本地和state位置
            setPosition({ lat: 0, lng: 0, unix: Date.now() });//地图刷新
            syncLocalPosition({ lat: 0, lng: 0, unix: Date.now(), });//本地存储同步
            setTimeout(() => {
                setLoading(false)

            }, 2000)
        } else {
            setLoading(false);
            //链接失败，展示最近一次位置
        }

    }



    useEffect(() => {


        //从本地恢复数据
        restorePosition();
        //同时重新刷新定位信息
        connectToLkkim();



    }, [])


    return (

        <View style={{ flex: 1 }}>

            <View style={styles.container}>


                <MapView
                    provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined} // remove if not using Google Maps
                    style={styles.map}
                    zoomEnabled
                    zoomControlEnabled={true}

                    region={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                >
                </MapView>
            </View>

            <View style={{ flex: 1, backgroundColor: '#f8f8f8', padding: 10, borderRadius: 20 }}>

                <View style={{ width: '10%', height: 5, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 10, marginLeft: '40%' }}></View>
                <View style={{ marginTop: 10, height: 50 }}>
                    <Text style={{ fontWeight: 800, fontSize: 16, marginBottom: 5 }}>My Likkim Device.</Text>
                    {
                        !loading && <Text style={{}}> {
                            Date.now() - positionUnix > unixOffest ? 'Last time：xxxxx' : 'Now:xxx'
                        }</Text>
                    }

                    {
                        loading && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{}}> Now:</Text><ActivityIndicator style={{ marginLeft: 5 }} />
                        </View>
                    }
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <Pressable onPress={connectToLkkim} style={{ backgroundColor: 'rgba(0,0,0,0.05)', width: '48%', margin: '1%', padding: 30, borderRadius: 10 }}>
                        <Text>ICON</Text>
                        <Text>Connect</Text>
                    </Pressable>

                    <Pressable style={{ backgroundColor: 'rgba(0,0,0,0.05)', width: '48%', margin: '1%', padding: 30, borderRadius: 10 }}>
                        <Text>ICON</Text>

                        <Text>Direction</Text>
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