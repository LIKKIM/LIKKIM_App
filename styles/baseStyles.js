import { RADIUS_20, RADIUS_30 } from "./constants";

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
