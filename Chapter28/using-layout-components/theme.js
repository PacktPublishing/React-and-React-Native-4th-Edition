import { extendTheme } from "native-base";

export const theme = extendTheme({
  fontConfig: {
    Roboto: {
      400: {
        normal: "Roboto_400Regular",
      },
      500: {
        normal: "Roboto_500Medium",
      },
    },
  },
  fonts: {
    heading: "Roboto",
    body: "Roboto",
    mono: "Roboto",
  },
});
