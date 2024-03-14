import { extendTheme } from "@chakra-ui/react";

const colors = {
  black: {
    500: "#000000",
  },
  sky: {
    default: "#50C5F0",
    100: "#ECF9FD",
    500: "#50C5F0",
    400: "#7CD4F4",
    600: "#31BBED",
  },
  cerulean: {
    500: "#3484A4",
    400: "#45A0C4",
    600: "#1D4A5D",
  },
  lightblue: {
    100: "#F2F6F8",
    500: "#AAC7D0",
    400: "#CADDE2",
    600: "#96BAC5",
  },
  ivory: {
    100: "#EFEFEF",
    400: "#FEFBEC",
    500: "#FEFBEC",
  },
};

export const sizing = {
  contentsMaxWidth: "70rem",
  blockSpacing: "2rem",
};

export const theme = extendTheme({
  colors,
});
