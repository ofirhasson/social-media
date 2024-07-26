const { default: theme, content } = require("@material-tailwind/react/theme");
const { default: zIndex } = require("@mui/material/styles/zIndex");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-main": "#18191A",
        "dark-second": "#242526",
        "dark-third": "#3A3B3C",
        "dark-txt": "#B8BBBF",
      },

      width: {
        78: `19rem`,
        74: "17.875rem",
        100: "416px",
        130: "783px"
      },
      height: {
        13: "3.25rem",
      },
      screens: {
        xs: "375px",
        xxs: "300px",
        md768: "768px",
        "lg-1000": "1000px",
        "lg-1024": "1024px",
        maxWLg: {'max': '1100px'},
        lgg: "1100px",
        lggg: "2200px",
      },
      zIndex: {
        100: "1000000",
      },
    },
  },
  variants: {
    extends: {
      display: ["group-hover"],
      transform: ["group-hover"],
      scale: ["group-hover"],
    },
  },
  plugins: [require("daisyui")],
};
