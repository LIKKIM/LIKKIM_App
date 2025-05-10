// utils/OnboardingScreen.js
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
  StatusBar,
  TouchableOpacity,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { languages } from "../config/languages";
import i18n from "../config/i18n";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ onDone }) => {
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [currentSlideKey, setCurrentSlideKey] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const fadeInUpAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AsyncStorage.getItem("selectedLanguage").then((value) => {
      if (value !== null) {
        setSelectedLanguage(value);
        i18n.changeLanguage(value);
      }
    });
  }, []);

  // Define slides based on the current language.
  const slides = [
    {
      key: "slide1",
      title: i18n.t("Welcome"),
      text: i18n.t("Your secure and intuitive companion app."),
      image: require("../assets/slider/slider1.png"),
    },
    {
      key: "slide2",
      title: i18n.t("Manage Your Assets"),
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
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem("selectedLanguage", lang);
    setLanguageModalVisible(false);
  };

  const startAnimation = () => {
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
  };

  // Reset animation when the slide changes.
  useEffect(() => {
    scaleAnim.setValue(0.8);
    fadeInUpAnim.setValue(0);
    opacityAnim.setValue(0);
    translateYAnim.setValue(30);
    startAnimation();
  }, [currentSlideKey]);

  const renderItem = ({ item, index }) => {
    return (
      <LinearGradient colors={["#21201E", "#0E0D0D"]} style={styles.slide}>
        {/* by will:优化引导页状态栏色差 */}
        <StatusBar backgroundColor={"rgb(82,82,82)"} barStyle="dark-content" />
        <BlurView intensity={50} style={StyleSheet.absoluteFillObject}>
          <LinearGradient
            colors={["#00000000", "#CCB68C30", "#CCB68C60"]}
            //start={{ x: 0.5, y: 0 }}
            //  end={{ x: 0.5, y: 0.9 }}
            style={StyleSheet.absoluteFillObject}
          />
        </BlurView>
        {index !== currentSlideKey ? null : (
          <View style={styles.content}>
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
        )}
      </LinearGradient>
    );
  };

  const renderNextButton = () => (
    <View style={styles.nextButton}>
      <Text style={styles.buttonText}>{i18n.t("Next")}</Text>
    </View>
  );

  const renderPrevButton = () => (
    <View style={styles.button}>
      <Text style={styles.buttonText}>{i18n.t("Back")}</Text>
    </View>
  );

  const renderDoneButton = () => (
    <View style={styles.doneButton}>
      <Text style={styles.buttonText}>{i18n.t("Start Exploring")}</Text>
    </View>
  );

  const renderSkipButton = () => (
    <TouchableOpacity style={styles.button} onPress={onDone}>
      <Text style={styles.buttonText}>{i18n.t("Skip")}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => setLanguageModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {languages.find((lang) => lang.code === selectedLanguage).name}
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView style={{ width: "100%" }}>
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
        renderItem={renderItem}
        data={slides}
        onDone={onDone}
        onSlideChange={(index) => setCurrentSlideKey(index)}
        renderSkipButton={renderSkipButton}
        renderNextButton={renderNextButton}
        renderPrevButton={renderPrevButton}
        renderDoneButton={renderDoneButton}
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
    justifyContent: "flex-start",
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
    borderColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#3F3D3C",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    maxHeight: "60%",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
    color: "#FFF",
  },
});

export default OnboardingScreen;
