import { RADIUS_16, RADIUS_20, RADIUS_30 } from "./constants";

// 通用按钮基础样式
export const buttonBase = {
  padding: 10,
  width: "100%", // 如需90%可在用到的地方覆盖
  justifyContent: "center",
  borderRadius: RADIUS_30,
  height: 60,
  alignItems: "center",
};

// 通用模态面板基础样式
export const modalPanelBase = {
  margin: 20,
  width: "90%",
  borderRadius: RADIUS_20,
  padding: 30,
  alignItems: "center",
};

// 通用标题基础样式
export const titleBase = {
  fontSize: 20,
  fontWeight: "bold",
};

// 通用居中灰色文本（需传 colors/mutedText）
export const textCenterMuted = (colors) => ({
  fontSize: 15,
  color: colors.mutedText,
  textAlign: "center",
});

// 卡片基础样式
export const cardBase = {
  borderRadius: RADIUS_20,
  overflow: "hidden",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 20,
};

// 图标基础样式
export const iconBase = {
  resizeMode: "contain",
  alignItems: "center",
  justifyContent: "center",
};

// 容器基础样式
export const containerBase = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
};

// 弹窗头部基础样式
export const modalHeaderBase = {
  width: "100%",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
};

// 带边框按钮基础样式
export const borderButtonBase = {
  borderWidth: 3,
  justifyContent: "center",
  alignItems: "center",
  height: 60,
  borderRadius: RADIUS_16,
  padding: 10,
};

export const cardShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
};

// 通用图片占位（NFT/Gallery无图等）
export const noImageContainer = {
  width: "100%",
  aspectRatio: 1,
  borderRadius: 8,
  backgroundColor: "#ccc",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  position: "relative",
};
export const noImageLogo = {
  position: "absolute",
  width: "50%",
  height: "50%",
  opacity: 0.2,
  resizeMode: "contain",
  top: "25%",
  left: "25%",
};
export const noImageText = {
  color: "#eee",
  fontWeight: "bold",
  position: "absolute",
  fontSize: 12,
  textAlign: "center",
};
