import { DefaultTheme, DarkTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  // dark: false,
  // myOwnProperty: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "orange",
    accent: "pink",
    background: "red",
  },
};
const darkTheme = {
  dark: true,
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "blue",
    accent: "red",
    background: "#000",
  },
};

export default { darkTheme, theme };
