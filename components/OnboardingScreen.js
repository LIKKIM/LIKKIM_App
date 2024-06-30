// components/OnboardingScreen.js
import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

const slides = [
  {
    key: "1",
    title: "Welcome to LIKKIM",
    text: "Your secure digital wallet.",
    image: require("../assets/slider/Onboarding1.png"),
  },
  {
    key: "2",
    title: "Manage Your Crypto",
    text: "Easily manage your cryptocurrencies.",
    image: require("../assets/slider/Onboarding2.png"),
  },
  {
    key: "3",
    title: "Stay Secure",
    text: "Your security is our priority.",
    image: require("../assets/slider/Onboarding3.png"),
  },
];

const OnboardingScreen = ({ onDone, onSkip }) => {
  const _renderItem = ({ item }) => (
    <ImageBackground source={item.image} style={styles.slide}>
      <View style={styles.overlay} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </ImageBackground>
  );

  const _renderNextButton = () => (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  );

  const _renderDoneButton = () => (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Done</Text>
    </TouchableOpacity>
  );

  const _renderSkipButton = () => (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Skip</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppIntroSlider
        renderItem={_renderItem}
        data={slides}
        onDone={onDone}
        showSkipButton
        onSkip={onSkip}
        renderNextButton={_renderNextButton}
        renderDoneButton={_renderDoneButton}
        renderSkipButton={_renderSkipButton}
        bottomButton
        dotStyle={styles.inactiveDot}
        activeDotStyle={styles.activeDot}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1D3F",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(30, 29, 63, 0.6)",
  },
  title: {
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#6C6CF4",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  activeDot: {
    backgroundColor: "#6C6CF4",
    width: 20,
    height: 8,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  inactiveDot: {
    backgroundColor: "#444284",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default OnboardingScreen;
