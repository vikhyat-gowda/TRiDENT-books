const defaultTheme = require("tailwindcss/defaultTheme");
const fontFamily = defaultTheme.fontFamily;
fontFamily["sans"] = [
  "Roboto", // <-- Roboto is a default sans font now
  "system-ui",
  // <-- you may provide more font fallbacks here
];

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontFamily: fontFamily, // <-- this is where the override is happening

    extend: {
      colors: {
        primaryDark: "#121212",
        primaryLight: "#333",
        primaryText: "#cad1d8",
        secondary: "#FC687B",
        contrast: "#03A4F6",

        //Light Mode
        lmPrimaryLight: "#f0f0f0",
        lmPrimaryDark: "#fff",
        lmPrimaryText: "#333333",
        lmTableDivider: "#ffffff99",

        //extra
        formbgDark: "#1d1e1f",
      },
      minHeight: {
        0: "0",
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        full: "100%",
      },
      screens: {
        small: "700px",
        medium: "1024px",
        large: "1340px",
        extralarge: "1690px",
      },
      backgroundImage: {
        loginBack0: "url('/src/assets/brandon-burridge-unsplash.jpg')",
        loginBack1: "url('/src/assets/will-van-wingerden-unsplash.jpg')",
        loginBack2:
          "url('/src/assets/zaini-izzuddin-55btQzyDiO8-unsplash.jpg')",
        loginBack3: "url('/src/assets/eli-francis-_M-DrbiNFa4-unsplash.jpg')",
        loginBack4: "url('/src/assets/susan-unsplash.jpg')",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
