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
      <View style={styles.content}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </LinearGradient>
  );

  const _renderSkipButton = () => (
    <TouchableOpacity style={styles.button} onPress={onDone}>
      <Text style={styles.buttonText}>Skip</Text>
    </TouchableOpacity>
  );

  const _renderNextButton = () => (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  );

  const _renderPrevButton = () => (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Back</Text>
    </TouchableOpacity>
  );

  const _renderDoneButton = () => (
    <TouchableOpacity style={styles.button} onPress={onDone}>
      <Text style={styles.buttonText}>Done</Text>
    </TouchableOpacity>
  );

  return (
    <AppIntroSlider
      bottomButton
      renderItem={_renderItem}
      data={slides}
      onDone={onDone}
      renderSkipButton={_renderSkipButton}
      renderNextButton={_renderNextButton}
      renderPrevButton={_renderPrevButton}
      renderDoneButton={_renderDoneButton}
      showSkipButton
      showPrevButton
    />
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
    paddingTop: 100,
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
    width: 300,
    height: 300,
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
    borderColor: "#6C6CF4",
    borderWidth: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default OnboardingScreen;
