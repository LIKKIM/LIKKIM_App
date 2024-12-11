// components/OnboardingScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { languages } from "../config/languages";
import i18n from "../config/i18n"; // 确保这个路径正确

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ onDone }) => {
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [currentSlideKey, setCurrentSlideKey] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // 初始缩放比例为1
  const opacityAnim = useRef(new Animated.Value(0)).current; // 初始透明度为0
  const translateYAnim = useRef(new Animated.Value(30)).current; // 初始位置稍低，用于从下到上的效果
  const fadeInUpAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AsyncStorage.getItem("selectedLanguage").then((value) => {
      if (value !== null) {
        setSelectedLanguage(value);
        i18n.changeLanguage(value);
      }
    });
  }, []);

  // 在这里定义slides，依赖于当前语言设置
  const slides = [
    {
      key: "slide1",
      title: i18n.t("Welcome to LIKKIM"),
      text: i18n.t("Your secure and user-friendly digital wallet."),
      image: require("../assets/slider/slider1.png"),
    },
    {
      key: "slide2",
      title: i18n.t("Manage Your Cryptos"),
      text: i18n.t("Easily manage multiple cryptocurrencies."),
      image: require("../assets/slider/slider2.png"),
    },
    {
      key: "slide3",
      title: i18n.t("Secure and Reliable"),
      text: i18n.t("Bank-level security for your digital assets."),
      image: require("../assets/slider/slider3.png"),
    },
  ];

  const handleLanguageChange = async (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang); // 切换i18n实例到新的语言
    await AsyncStorage.setItem("selectedLanguage", lang);
    setLanguageModalVisible(false);
  };

  const startAni = () => {

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeInUpAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }


  //更改卡片后重置动画
  useEffect(() => {
    scaleAnim.setValue(0.8);
    fadeInUpAnim.setValue(0);
    opacityAnim.setValue(0);
    translateYAnim.setValue(30);
    startAni();

  }, [currentSlideKey])


  const _renderItem = (props) => {

    const { item, index } = props;
    return (
      <LinearGradient colors={["#21201E", "#0E0D0D"]} style={styles.slide}>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setLanguageModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {languages.find((lang) => lang.code === selectedLanguage).name}
          </Text>
        </TouchableOpacity>
        {
          //卡片未切到的时候，禁止渲染内容。
          index != currentSlideKey ? null : <View style={styles.content}>
            <Animated.Image
              source={item.image}
              style={{
                ...styles.image,
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              }}
            />
            <Animated.Text
              style={[
                styles.title,
                {
                  opacity: fadeInUpAnim,
                  transform: [
                    {
                      translateY: fadeInUpAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {item.title}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.text,
                {
                  opacity: fadeInUpAnim,
                  transform: [
                    {
                      translateY: fadeInUpAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {item.text}
            </Animated.Text>
          </View>
        }
      </LinearGradient>
    );
  };

  // 确保其余按钮和文本使用 i18n 进行国际化
  const _renderNextButton = () => (
    <View style={styles.nextButton}>
      <Text style={styles.buttonText}>{i18n.t("Next")}</Text>
    </View>
  );

  const _renderPrevButton = () => (
    <View style={styles.button}>
      <Text style={styles.buttonText}>{i18n.t("Back")}</Text>
    </View>
  );

  const _renderDoneButton = () => (
    <View style={styles.doneButton}>
      <Text style={styles.buttonText}>{i18n.t("Start Exploring")}</Text>
    </View>
  );

  const _renderSkipButton = () => (
    <TouchableOpacity style={styles.button} onPress={onDone}>
      <Text style={styles.buttonText}>{i18n.t("Skip")}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView
              style={{
                width: "100%",
              }}
            >
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.languageOption}
                  onPress={() => handleLanguageChange(lang.code)}
                >
                  <Text style={styles.languageText}>{lang.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <AppIntroSlider
        bottomButton
        renderItem={_renderItem}
        data={slides}
        onDone={onDone}
        onSlideChange={(index, key) => setCurrentSlideKey(index)} // 更新当前滑动页键值
        renderSkipButton={_renderSkipButton}
        renderNextButton={_renderNextButton}
        renderPrevButton={_renderPrevButton}
        renderDoneButton={_renderDoneButton}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        showSkipButton
        showPrevButton
      />
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    alignItems: "center",
    justifyContent: "start",
    width: width,
    height: height,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#8B8B96",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  image: {
    height: "40%",
    resizeMode: "contain",
    marginVertical: 32,
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    borderRadius: 30,
    marginTop: 20,
    padding: 10,
    borderColor: "#CCB68C",
    borderWidth: 3,
    marginBottom: 60,
  },
  nextButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    borderRadius: 30,
    marginTop: 20,
    padding: 10,
    backgroundColor: "#CCB68C",
  },
  doneButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    borderRadius: 30,
    marginTop: 20,
    padding: 10,
    backgroundColor: "#CCB68C",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  dot: {
    backgroundColor: "#8B8B96",
    height: 4,
  },
  activeDot: {
    backgroundColor: "#CCB68C",
    width: 24,
    height: 4,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  languageButton: {
    zIndex: 100,
    position: "absolute",
    top: 70,
    right: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff", // 白色边框
    flexDirection: "row", // 横向排列
    alignItems: "center", // 垂直居中
    justifyContent: "center", // 水平居中
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)", // 半透明黑色背景，适用于深色模式
  },
  modalView: {
    margin: 20,
    backgroundColor: "#3F3D3C", // 深色模式下的深蓝色背景
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    maxHeight: "60%",
    width: "80%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  languageOption: {
    padding: 10,
    alignItems: "center",
  },
  languageText: {
    fontSize: 18,
    color: "#FFF", // 深色模式下的文字通常是白色
  },
});

export default OnboardingScreen;
