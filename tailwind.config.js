const BREAKPOINTS = {
  sm: 768,
  md: 992,
  lg: 1200,
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  corePlugins: {
    preflight: false,
  },
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        xs: {
          max: `${BREAKPOINTS.sm}px`,
        },
        sm: {
          max: `${BREAKPOINTS.md}px`,
        },
        md: {
          min: `${BREAKPOINTS.sm + 1}px`,
          max: `${BREAKPOINTS.lg}px`,
        },
        lg: {
          min: `${BREAKPOINTS.md + 1}px`,
        },
        xl: {
          min: `${BREAKPOINTS.lg + 1}px`,
        },
      },
      colors: {
        primary: {
          DEFAULT: "#3880EC",
          hover: "#1C73F5",
        },
        error: {
          DEFAULT: "#DA3A3A",
          hover: "#EA2121",
        },
        success: {
          DEFAULT: "#21BC31",
          hover: "#19D720",
        },
      },
    },
  },
  plugins: [],
};
