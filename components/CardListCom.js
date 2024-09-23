import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, Text, Animated, StyleSheet, PanResponder, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { CryptoContext } from "./CryptoContext";




/**
 * 
 * TODO fix
 * @param {*} param0 
 * @returns 
 */
const WalletList = ({ cards, priceChanges, WalletScreenStyle, modalVisible, handleQRCodePress }) => {


    const [items, setItems] = useState(cards || []);
    const { exchangeRates, currencyUnit, } = useContext(CryptoContext);
    const positions = useRef(items.map(() => new Animated.Value(0))).current; // 使用 Animated.Value 控制 translateY
    const [draggingIndex, setDraggingIndex] = useState(null); // 当前拖动的项索引
    const [isLongPressed, setIsLongPressed] = useState(false);
    const longPressTimeout = useRef(null); // 定时器引用
    const lastSwapIndex = useRef(null); // 记录上次交换的索引



    const getConvertedBalance = (cardBalance, cardShortName) => {
        // 获取到当前的法定货币汇率
        const rate = exchangeRates[currencyUnit]; // 当前法定货币的汇率（例如 USD, CNY 等）
        const cryptoToUsdRate = exchangeRates[cardShortName] || 1; // 加密货币兑换 USD 的汇率

        if (!rate) {
            return cardBalance; // 如果没有找到汇率，返回原始余额
        }

        // 将加密货币余额转换为 USD，再转换为目标货币
        const usdBalance = cardBalance * cryptoToUsdRate;
        return (usdBalance * rate).toFixed(2); // 返回法定货币的余额并保留两位小数
    };


    // 交换列表项顺序
    const swapItems = (fromIndex, toIndex) => {
        const newItems = [...items];
        [newItems[fromIndex], newItems[toIndex]] = [newItems[toIndex], newItems[fromIndex]];

        //交换卡片数据的位置

        const fromPosition = positions[fromIndex].__getValue();
        const toPosition = positions[toIndex].__getValue();
        //交换卡片动画的为止数据
        positions[fromIndex].setValue(toPosition); // 将从位置设置为目标位置
        positions[toIndex].setValue(fromPosition); // 将目标位置设置为从位置

        setItems(newItems);


        positions.map((p, pi) => {
            console.log(pi)
            Animated.spring(positions[pi], {
                toValue: 0,
                bounciness: 2,
                useNativeDriver: true,
            }).start();
        })




    };


    // 生成每个列表项的 PanResponder
    const panResponders = cards.map((_, index) => {
        // console.log(cards)
        return PanResponder.create({
            onPanResponderTerminationRequest: () => false,
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setDraggingIndex(index); // 设置当前拖动的项
                lastSwapIndex.current = index; // 初始化上次交换索引
            },
            onPanResponderGrant: (e) => {

                longPressTimeout.current = setTimeout(() => {
                    setIsLongPressed(true);
                    Animated.timing(positions[index], {
                        toValue: -15,
                        speed: 8,
                        useNativeDriver: true,
                    }).start();
                }, 500); // 500ms 后触发长按

            },
            onPanResponderTerminate: () => {
                clearTimeout(longPressTimeout.current);
                Animated.spring(positions[index], {
                    toValue: 0,
                    speed: 8,
                    bounciness: 2,
                    useNativeDriver: true,
                }).start(() => {
                    positions[index].setValue(0);
                })

            },
            onPanResponderMove: (e, gestureState) => {

                clearTimeout(longPressTimeout.current); // 清除定时器

                if (positions[index].__getValue() == 0 || !isLongPressed) return;

                const threshold = 35; // 设置交换的阈值
                // 拖动时更新列表项的位置
                positions[index].setValue(gestureState.dy);
                //第一个卡片禁止上排序
                if (gestureState.dy < -threshold && index == 0) {
                    Animated.spring(positions[index], {
                        toValue: 0,

                        useNativeDriver: true,
                    }).start(() => {
                        positions[index].setValue(0);
                    })
                    return;

                }


                console.log(gestureState.dy)
                // 卡片移动超过阈值，检查是否要交换
                if (Math.abs(gestureState.dy) >= threshold) {
                    let targetIndex = null;
                    if (gestureState.dy >= threshold && index < items.length - 1) {
                        targetIndex = index + 1; // 向下交换
                    } else if (gestureState.dy <= -threshold && index > 0) {
                        targetIndex = index - 1; // 向上交换
                    }

                    console.log(gestureState.dy)

                    if ((targetIndex !== null && lastSwapIndex.current !== targetIndex) || index == items.length - 2) {
                        // 触发交换并记录最后一次交换的索引
                        lastSwapIndex.current = targetIndex;

                        Animated.spring(positions[index], {
                            toValue: 0,
                            useNativeDriver: true
                        }).start(() => {
                            swapItems(index, targetIndex);
                        })

                    } else {
                        console.log('不交换', targetIndex, lastSwapIndex)
                    }
                }


            },
            onPanResponderRelease: (e, gestureState) => {
                lastSwapIndex.current = null;
                clearTimeout(longPressTimeout.current); // 确保清除定时器
                setIsLongPressed(false);
                positions.map((p, pi) => {
                    positions[pi].setValue(0);
                    Animated.spring(positions[pi], {
                        toValue: 0,
                        bounciness: 2,
                        useNativeDriver: true,
                    }).start(() => {

                        setDraggingIndex(null);
                    });
                })

            },
        });
    });

    return (<View style={{ flex: 1, position: 'relative', marginTop: 126 }}>
        {items.map((card, index) => {


            const isBlackText = ["BTC", "USDT", "BCH", "DOT", "DOGE"].includes(
                card.shortName
            );
            const priceChange = priceChanges[card.shortName]?.priceChange || "0";
            const percentageChange = priceChanges[card.shortName]?.percentageChange || "0";
            const textColor = priceChange > 0 ? isBlackText ? "#FF5252" : "#F23645" : isBlackText ? "#22AA94" : "#0C9981";

            return (<Animated.View
                key={card.name}
                style={[
                    {
                        marginTop: -126
                    },
                    WalletScreenStyle.card,
                    // index === 0
                    //     ? WalletScreenStyle.cardFirst
                    //     : WalletScreenStyle.cardOthers,
                    // draggingIndex === index && animatedCardStyle(index),

                    { transform: [{ translateY: positions[index] }] }, // 使用 translateY 控制位置
                ]}
                {...panResponders[index].panHandlers}
            >
                <ImageBackground
                    source={card.cardImage}
                    style={{ width: "100%", height: "100%" }}
                    imageStyle={{ borderRadius: 16 }}
                >
                    {["cardIconContainer", "cardChainIconContainer"].map(
                        (styleKey, i) => (
                            <View key={i} style={WalletScreenStyle[styleKey]}>
                                <Image
                                    source={i === 0 ? card.icon : card.chainIcon}
                                    style={
                                        i === 0
                                            ? WalletScreenStyle.cardIcon
                                            : WalletScreenStyle.chainIcon
                                    }
                                />
                            </View>
                        )
                    )}

                    <View style={WalletScreenStyle.cardInfoContainer}>
                        {["cardName", "chainText"].map((textStyle, i) =>
                            i === 0 ? (
                                <Text
                                    key={i}
                                    style={[
                                        WalletScreenStyle[textStyle],
                                        { color: isBlackText ? "#333" : "#eee" },
                                    ]}
                                >
                                    {card.name}
                                </Text>
                            ) : (
                                <View
                                    key={i}
                                    style={[
                                        WalletScreenStyle.chainContainer, // 新增按钮样式
                                        // 根据主题颜色改变按钮背景色
                                    ]}
                                >
                                    <Text
                                        style={[
                                            WalletScreenStyle.chainCardText,
                                            { color: isBlackText ? "#333" : "#eee" },
                                        ]}
                                    >
                                        {card.chain}
                                    </Text>
                                </View>
                            )
                        )}
                    </View>

                    <Text
                        style={[
                            WalletScreenStyle.cardShortName,
                            isBlackText && { color: "#121518" },
                        ]}
                    >
                        {card.shortName}
                    </Text>

                    {!modalVisible ? (
                        <>
                            <Text
                                style={[
                                    WalletScreenStyle.cardBalance,
                                    isBlackText && { color: "#121518" },
                                ]}
                            >
                                {`${card.balance} ${card.shortName}`}
                            </Text>
                            <View style={WalletScreenStyle.priceChangeView}>
                                <Text style={{ color: textColor, fontWeight: "bold" }}>
                                    {percentageChange > 0 ? "+" : ""}
                                    {percentageChange}%
                                </Text>
                                <Text
                                    style={[
                                        WalletScreenStyle.balanceShortName,
                                        isBlackText && { color: "#121518" },
                                    ]}
                                >
                                    {`${getConvertedBalance(
                                        card.balance,
                                        card.shortName
                                    )} ${currencyUnit}`}
                                </Text>
                            </View>
                        </>
                    ) : (
                        cardInfoVisible && (
                            <View style={WalletScreenStyle.cardModalContent}>
                                <TouchableOpacity
                                    onPress={() => handleQRCodePress(card)}
                                    style={{ position: "absolute", right: 0, top: 0 }}
                                >
                                    <Image
                                        source={require("../assets/icon/QR.png")}
                                        style={[
                                            WalletScreenStyle.QRImg,
                                            isBlackText && { tintColor: "#121518" },
                                        ]}
                                    />
                                </TouchableOpacity>
                                {["cardBalanceCenter", "balanceShortNameCenter"].map(
                                    (styleKey, i) => (
                                        <Text
                                            key={i}
                                            style={[
                                                WalletScreenStyle[styleKey],
                                                isBlackText && { color: "#121518" },
                                            ]}
                                        >
                                            {`${i === 0
                                                ? card.balance
                                                : getConvertedBalance(
                                                    card.balance,
                                                    card.shortName
                                                )
                                                } ${i === 0 ? card.shortName : currencyUnit}`}
                                        </Text>
                                    )
                                )}
                            </View>
                        )
                    )}
                </ImageBackground>
            </Animated.View>)

        }
        )}

    </View>
    );
};


export default WalletList;