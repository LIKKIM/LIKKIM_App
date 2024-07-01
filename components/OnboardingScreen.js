// components/OnboardingScreen.js
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    key: "slide1",
    title: "Welcome to LIKKIM",
    text: "Your secure and user-friendly digital wallet.",
    image: require("../assets/slider/slider1.png"),
  },
  {
    key: "slide2",
    title: "Manage Your Cryptos",
    text: "Easily manage multiple cryptocurrencies.",
    image: require("../assets/slider/slider2.png"),
  },
  {
    key: "slide3",
    title: "Secure and Reliable",
    text: "Bank-level security for your digital assets.",
    image: require("../assets/slider/slider3.png"),
  },
];

const OnboardingScreen = ({ onDone }) => {
  const _renderItem = ({ item }) => (
    <LinearGradient colors={["#24234C", "#101021"]} style={styles.slide}>
      <Text style={styles.title}>{item.title}</Text>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.text}>{item.text}</Text>
    </LinearGradient>
  );

  const _renderSkipButton = () => (
    <TouchableOpacity style={styles.button} onPress={onDone}>
      <Text style={styles.buttonText}>Skip</Text>
    </TouchableOpacity>
  );

  return (
    <AppIntroSlider
      renderItem={_renderItem}
      data={slides}
      onDone={onDone}
      renderSkipButton={_renderSkipButton}
      showSkipButton
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: width,
    height: height,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  image: {
    width: width * 0.8,
    height: height * 0.5,
    resizeMode: "contain",
    marginVertical: 32,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
  },
});

export default OnboardingScreen;
