import React, { useRef, useEffect, useState } from "react";
import { Modal, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Animated } from "react-native";

/**
 * 通用带动画的 Blur Modal 组件
 *
 * Props:
 * - visible: 控制显示/隐藏
 * - onRequestClose: Modal 关闭回调
 * - blurStyle: BlurView 的样式
 * - children: Modal 内容
 * - intensityIn: 进入动画目标值（默认20）
 * - intensityOut: 退出动画目标值（默认0）
 * - durationIn: 进入动画时长（默认600ms，分两段400+200）
 * - durationOut: 退出动画时长（默认400ms）
 * - modalProps: 透传给 Modal 的其他参数
 * - blurProps: 透传给 BlurView 的其他参数
 */
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const BLUR_INTENSITY_IN = 20;
const BLUR_INTENSITY_OUT = 0;
const BLUR_DURATION_IN = 600; // 进入动画总时长（400+200）
const BLUR_DURATION_OUT = 400; // 退出动画时长

export default function AnimatedBlurModal({
  visible,
  onRequestClose,
  blurStyle,
  children,
  intensityIn = BLUR_INTENSITY_IN,
  intensityOut = BLUR_INTENSITY_OUT,
  durationIn = BLUR_DURATION_IN,
  durationOut = BLUR_DURATION_OUT,
  modalProps = {},
  blurProps = {},
}) {
  const [showModal, setShowModal] = useState(false);
  const intensityAnim = useRef(new Animated.Value(intensityOut)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      // 进入动画：0->0(400ms)->intensityIn(200ms)
      Animated.sequence([
        Animated.timing(intensityAnim, {
          toValue: intensityOut,
          duration: durationIn - 200,
          useNativeDriver: false,
        }),
        Animated.timing(intensityAnim, {
          toValue: intensityIn,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (showModal) {
      // 退出动画
      Animated.timing(intensityAnim, {
        toValue: intensityOut,
        duration: durationOut,
        useNativeDriver: false,
      }).start(() => {
        setShowModal(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={showModal}
      onRequestClose={onRequestClose}
      {...modalProps}
    >
      <AnimatedBlurView
        intensity={intensityAnim}
        style={blurStyle}
        {...blurProps}
      >
        {children}
      </AnimatedBlurView>
    </Modal>
  );
}
